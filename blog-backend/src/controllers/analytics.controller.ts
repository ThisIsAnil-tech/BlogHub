import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export const AnalyticsController = {
  // Get analytics data (admin only)
  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { period = '7d' } = req.query;
      
      const startDate = new Date();
      const endDate = new Date();

      switch (period) {
        case '1d':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const analytics = await AnalyticsService.getAnalytics(startDate, endDate);
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  },

  // Get real-time stats (admin only)
  async getRealTimeStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [
        activeUsers,
        viewsLastHour,
        viewsLast24Hours,
        newComments
      ] = await Promise.all([
        // Active users (views in last 5 minutes)
        AnalyticsService.getActiveUsers(),
        // Views in last hour
        AnalyticsService.getViewsSince(oneHourAgo),
        // Views in last 24 hours
        AnalyticsService.getViewsSince(twentyFourHoursAgo),
        // New comments awaiting approval
        AnalyticsService.getNewCommentsCount()
      ]);

      res.json({
        activeUsers,
        viewsLastHour,
        viewsLast24Hours,
        newComments,
        timestamp: now
      });
    } catch (error) {
      next(error);
    }
  },

  // Get popular content (public)
  async getPopularContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit = 10, period = '7d' } = req.query;
      
      const startDate = new Date();
      switch (period) {
        case '1d':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const popularBlogs = await AnalyticsService.getPopularBlogsSince(
        startDate,
        Number(limit)
      );

      res.json(popularBlogs);
    } catch (error) {
      next(error);
    }
  }
};