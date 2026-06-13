import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/popular', AnalyticsController.getPopularContent);

// Admin / Editor / Viewer routes
router.get('/', authenticate, authorize('admin', 'editor', 'viewer'), AnalyticsController.getAnalytics);
router.get('/realtime', authenticate, authorize('admin', 'editor', 'viewer'), AnalyticsController.getRealTimeStats);

export default router;