import mongoose, { Schema, Document } from 'mongoose';

export interface IImageMetadata extends Document {
  url: string;
  provider: 'local' | 'cloudinary' | 's3';
  publicId: string; // Cloudinary publicId, S3 key, or local filename
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: mongoose.Types.ObjectId;
  dimensions?: {
    width: number;
    height: number;
  };
  associatedId?: mongoose.Types.ObjectId; // ID of the Blog, Profile, etc.
  associatedModel?: 'ParentBlog' | 'ChildBlog' | 'User';
  createdAt: Date;
  updatedAt: Date;
}

const ImageMetadataSchema = new Schema<IImageMetadata>(
  {
    url: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ['local', 'cloudinary', 's3'],
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    associatedId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    associatedModel: {
      type: String,
      enum: ['ParentBlog', 'ChildBlog', 'User'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ImageMetadataSchema.index({ publicId: 1 });
ImageMetadataSchema.index({ associatedId: 1 });

export default mongoose.model<IImageMetadata>('ImageMetadata', ImageMetadataSchema);
