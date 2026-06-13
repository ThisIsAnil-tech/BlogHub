import { Router } from 'express';
import { ParentBlogController } from '../controllers/parentBlog.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  validateRequest,
  createParentBlogSchema,
  updateParentBlogSchema,
  paramIdSchema,
  paginationQuerySchema,
  slugParamSchema
} from '../validators/schema.validator';

const router = Router();

// Public routes
router.get('/', ParentBlogController.getAll);
router.get('/:slug', validateRequest({ params: slugParamSchema }), ParentBlogController.getBySlug);

// Admin / Editor / Viewer routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'editor'),
  validateRequest({ body: createParentBlogSchema }),
  ParentBlogController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'editor'),
  validateRequest({ params: paramIdSchema, body: updateParentBlogSchema }),
  ParentBlogController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest({ params: paramIdSchema }),
  ParentBlogController.delete
);

router.get(
  '/admin/list',
  authenticate,
  authorize('admin', 'editor', 'viewer'),
  validateRequest({ query: paginationQuerySchema }),
  ParentBlogController.getAdminList
);

export default router;