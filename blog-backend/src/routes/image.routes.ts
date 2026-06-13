import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/multer.middleware';
import { StorageService } from '../services/storage.service';
import { uploadLimiter } from '../middleware/rateLimit.middleware';
import { paramIdSchema, validateRequest } from '../validators/schema.validator';
import { ValidationError } from '../utils/errors';

const router = Router();

// Upload image (Authenticated users: Admin and Editors)
router.post(
  '/upload',
  authenticate,
  authorize('admin', 'editor'),
  uploadLimiter,
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new ValidationError('No image file provided');
      }

      const userId = (req as any).user?._id?.toString();
      const metadata = await StorageService.uploadImage(req.file, userId);
      
      res.status(201).json({
        message: 'Image uploaded successfully',
        image: metadata
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete image (Admin only or the user who uploaded it)
router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'editor'),
  validateRequest({ params: paramIdSchema }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await StorageService.deleteImage(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
