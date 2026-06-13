import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

export const NotificationController = {
  // Get user notifications
  async getUserNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      
      const unreadOnly = req.query.unreadOnly === 'true';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const notifications = await NotificationService.getUserNotifications(
        userId.toString(),
        unreadOnly,
        limit
      );

      res.json(notifications);
    } catch (error) {
      next(error);
    }
  },

  // Mark notification as read
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      await NotificationService.markAsRead(id, userId.toString());
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  },

  // Mark all notifications as read
  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      await NotificationService.markAllAsRead(userId.toString());
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  },

  // Delete notification
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      await NotificationService.delete(id, userId.toString());
      res.json({ message: 'Notification deleted' });
    } catch (error) {
      next(error);
    }
  },

  // Get notification count (unread)
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const count = await NotificationService.getUnreadCount(userId.toString());
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }
};