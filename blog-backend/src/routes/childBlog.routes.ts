import { Router } from 'express';
import { ChildBlogController } from '../controllers/childBlog.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  validateRequest,
  createChildBlogSchema,
  updateChildBlogSchema,
  paramIdSchema,
  slugParamSchema,
  paginationQuerySchema
} from '../validators/schema.validator';

const router = Router();

// Public routes
router.get('/', validateRequest({ query: paginationQuerySchema }), ChildBlogController.getAll);
router.get('/:slug', validateRequest({ params: slugParamSchema }), ChildBlogController.getBySlug);
router.post('/:id/view', validateRequest({ params: paramIdSchema }), ChildBlogController.incrementViews);

// Admin / Editor / Viewer routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'editor'),
  validateRequest({ body: createChildBlogSchema }),
  ChildBlogController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'editor'),
  validateRequest({ params: paramIdSchema, body: updateChildBlogSchema }),
  ChildBlogController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'editor'),
  validateRequest({ params: paramIdSchema }),
  ChildBlogController.delete
);

router.get(
  '/admin/list',
  authenticate,
  authorize('admin', 'editor', 'viewer'),
  validateRequest({ query: paginationQuerySchema }),
  ChildBlogController.getAdminList
);

export default router;