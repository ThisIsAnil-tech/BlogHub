import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  validateRequest,
  createTagSchema,
  updateTagSchema,
  paramIdSchema,
  slugParamSchema,
  paginationQuerySchema
} from '../validators/schema.validator';

const router = Router();

// Public routes
router.get('/', TagController.getAll);
router.get('/cloud', TagController.getCloud);
router.get('/:slug', validateRequest({ params: slugParamSchema, query: paginationQuerySchema }), TagController.getBySlug);

// Admin / Editor routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'editor'),
  validateRequest({ body: createTagSchema }),
  TagController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'editor'),
  validateRequest({ params: paramIdSchema, body: updateTagSchema }),
  TagController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({ params: paramIdSchema }),
  TagController.delete
);

export default router;