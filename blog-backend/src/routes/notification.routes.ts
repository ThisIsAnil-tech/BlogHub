import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest, paramIdSchema, paginationQuerySchema } from '../validators/schema.validator';

const router = Router();

// Protected routes
router.get('/', authenticate, validateRequest({ query: paginationQuerySchema }), NotificationController.getUserNotifications);
router.get('/unread-count', authenticate, NotificationController.getUnreadCount);
router.put('/:id/read', authenticate, validateRequest({ params: paramIdSchema }), NotificationController.markAsRead);
router.put('/mark-all-read', authenticate, NotificationController.markAllAsRead);
router.delete('/:id', authenticate, validateRequest({ params: paramIdSchema }), NotificationController.delete);

export default router;