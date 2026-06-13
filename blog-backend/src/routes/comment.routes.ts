import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  validateRequest,
  createCommentSchema,
  bulkCommentActionSchema,
  paramIdSchema,
  blogIdParamSchema,
  paginationQuerySchema
} from '../validators/schema.validator';

const router = Router();

// Public routes
router.get('/blog/:blogId', validateRequest({ params: blogIdParamSchema }), CommentController.getByBlog);
router.post('/blog/:blogId', validateRequest({ params: blogIdParamSchema, body: createCommentSchema }), CommentController.create);

// Admin / Editor / Viewer routes
router.get('/admin/list', authenticate, authorize('admin', 'editor', 'viewer'), validateRequest({ query: paginationQuerySchema }), CommentController.getAdminList);
router.put('/:id/approve', authenticate, authorize('admin', 'editor'), validateRequest({ params: paramIdSchema }), CommentController.approve);
router.delete('/:id', authenticate, authorize('admin', 'editor'), validateRequest({ params: paramIdSchema }), CommentController.delete);
router.post('/bulk-approve', authenticate, authorize('admin', 'editor'), validateRequest({ body: bulkCommentActionSchema }), CommentController.bulkApprove);
router.post('/bulk-delete', authenticate, authorize('admin', 'editor'), validateRequest({ body: bulkCommentActionSchema }), CommentController.bulkDelete);

export default router;