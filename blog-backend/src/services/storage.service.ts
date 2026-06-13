import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import env from '../config/env';
import ImageMetadata from '../models/ImageMetadata';
import { AppError } from '../utils/errors';

// Helper to extract image dimensions from buffer (pure JS, 0 dependencies)
function getImageDimensions(buffer: Buffer, mimeType: string): { width: number; height: number } | undefined {
  try {
    if (mimeType === 'image/png' && buffer.length >= 24) {
      const width = buffer.readInt32BE(16);
      const height = buffer.readInt32BE(20);
      return { width, height };
    }
    if (mimeType === 'image/gif' && buffer.length >= 10) {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height };
    }
    if (mimeType === 'image/jpeg') {
      let i = 0;
      if (buffer[i] === 0xFF && buffer[i + 1] === 0xD8) {
        i += 2;
        while (i < buffer.length) {
          if (buffer[i] === 0xFF && (buffer[i + 1] >= 0xC0 && buffer[i + 1] <= 0xC3)) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            return { width, height };
          } else {
            const markerLength = buffer.readUInt16BE(i + 2);
            i += 2 + markerLength;
          }
        }
      }
    }
    if (mimeType === 'image/webp' && buffer.length >= 30) {
      const riff = buffer.toString('ascii', 0, 4);
      const webp = buffer.toString('ascii', 8, 12);
      if (riff === 'RIFF' && webp === 'WEBP') {
        const type = buffer.toString('ascii', 12, 16);
        if (type === 'VP8 ') {
          const width = buffer.readUInt16LE(26) & 0x3fff;
          const height = buffer.readUInt16LE(28) & 0x3fff;
          return { width, height };
        } else if (type === 'VP8L') {
          const val = buffer.readUInt32LE(21);
          const width = (val & 0x3fff) + 1;
          const height = ((val >> 14) & 0x3fff) + 1;
          return { width, height };
        } else if (type === 'VP8X') {
          const width = (buffer.readUInt32LE(24) & 0xffffff) + 1;
          const height = (buffer.readUInt32LE(27) & 0xffffff) + 1;
          return { width, height };
        }
      }
    }
  } catch (e) {
    // ignore parsing errors
  }
  return undefined;
}

export class StorageService {
  static async uploadImage(file: Express.Multer.File, userId: string) {
    const provider = env.STORAGE_PROVIDER;
    const fileBuffer = file.buffer;
    const dimensions = getImageDimensions(fileBuffer, file.mimetype);

    if (provider === 'cloudinary') {
      return this.uploadToCloudinary(file, userId, dimensions);
    } else if (provider === 's3') {
      return this.uploadToS3(file, userId, dimensions);
    } else {
      return this.uploadToLocal(file, userId, dimensions);
    }
  }

  private static async uploadToLocal(file: Express.Multer.File, userId: string, dimensions?: any) {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const randomName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
    const filePath = path.join(uploadDir, randomName);
    
    fs.writeFileSync(filePath, file.buffer);
    
    const url = `/uploads/${randomName}`;

    const metadata = await ImageMetadata.create({
      url,
      provider: 'local',
      publicId: randomName,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId,
      dimensions
    });

    return metadata;
  }

  private static async uploadToCloudinary(file: Express.Multer.File, userId: string, dimensions?: any) {
    try {
      // Dynamic import to avoid crash if not installed
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({
        cloud_name: env.CLOUDINARY_CLOUD_NAME,
        api_key: env.CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET
      });

      return new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'blog_images', resource_type: 'image' },
          async (error: any, result: any) => {
            if (error) {
              return reject(new AppError(`Cloudinary Upload Error: ${error.message}`, 500));
            }
            try {
              const metadata = await ImageMetadata.create({
                url: result.secure_url,
                provider: 'cloudinary',
                publicId: result.public_id,
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype,
                uploadedBy: userId,
                dimensions: dimensions || { width: result.width, height: result.height }
              });
              resolve(metadata);
            } catch (dbErr) {
              reject(dbErr);
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    } catch (err: any) {
      throw new AppError(`Could not initialize Cloudinary: ${err.message}`, 500);
    }
  }

  private static async uploadToS3(file: Express.Multer.File, userId: string, dimensions?: any) {
    try {
      const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
      const s3Client = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY
        }
      });

      const randomKey = `images/${crypto.randomBytes(16).toString('hex')}${path.extname(file.originalname)}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: randomKey,
        Body: file.buffer,
        ContentType: file.mimetype
      }));

      const url = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${randomKey}`;

      const metadata = await ImageMetadata.create({
        url,
        provider: 's3',
        publicId: randomKey,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,
        dimensions
      });

      return metadata;
    } catch (err: any) {
      throw new AppError(`S3 Upload Failed: ${err.message}`, 500);
    }
  }

  static async deleteImage(id: string) {
    const metadata = await ImageMetadata.findById(id);
    if (!metadata) {
      throw new AppError('Image not found in database', 404);
    }

    const { provider, publicId } = metadata;

    if (provider === 'local') {
      const filePath = path.join(__dirname, '../../uploads', publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else if (provider === 'cloudinary') {
      try {
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: env.CLOUDINARY_CLOUD_NAME,
          api_key: env.CLOUDINARY_API_KEY,
          api_secret: env.CLOUDINARY_API_SECRET
        });
        await cloudinary.uploader.destroy(publicId);
      } catch (e: any) {
        console.error('Failed to delete image from Cloudinary:', e.message);
      }
    } else if (provider === 's3') {
      try {
        const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
        const s3Client = new S3Client({
          region: env.AWS_REGION,
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY
          }
        });
        await s3Client.send(new DeleteObjectCommand({
          Bucket: env.AWS_BUCKET_NAME,
          Key: publicId
        }));
      } catch (e: any) {
        console.error('Failed to delete image from S3:', e.message);
      }
    }

    await metadata.deleteOne();
    return { success: true };
  }

  // Delete matching url if stored in metadata
  static async deleteImageByUrl(url: string) {
    const metadata = await ImageMetadata.findOne({ url });
    if (metadata) {
      await this.deleteImage(metadata._id.toString());
    }
  }

  // Find and clean up orphaned images (older than 24 hours and not associated)
  static async cleanupOrphanedImages() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    const orphaned = await ImageMetadata.find({
      associatedId: null,
      createdAt: { $lt: cutoff }
    });

    let count = 0;
    for (const image of orphaned) {
      try {
        await this.deleteImage(image._id.toString());
        count++;
      } catch (e: any) {
        console.error(`Failed to cleanup orphaned image ${image._id}:`, e.message);
      }
    }
    return count;
  }
}
