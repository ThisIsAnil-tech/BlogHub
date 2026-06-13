import mongoose from 'mongoose';
import Notification from '../models/Notification';
import { NotFoundError } from '../utils/errors';

export class NotificationService {
  static async getUserNotifications(userId: string, unreadOnly = false, limit = 20) {
    const where: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (unreadOnly) {
      where.isRead = false;
    }

    return await Notification.find(where)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  static async markAsRead(id: string, userId: string) {
    const notification = await Notification.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  static async markAllAsRead(userId: string) {
    await Notification.updateMany(
      {
        userId: new mongoose.Types.ObjectId(userId),
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );
  }

  static async delete(id: string, userId: string) {
    const notification = await Notification.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    await Notification.deleteOne({ _id: id });
  }

  static async getUnreadCount(userId: string): Promise<number> {
    return await Notification.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      isRead: false
    });
  }

  static async createNotification(
    userId: string,
    type: 'new_comment' | 'blog_published' | 'system',
    title: string,
    message: string,
    data?: any
  ) {
    return await Notification.create({
      type,
      userId: new mongoose.Types.ObjectId(userId),
      title,
      message,
      data: data || {},
      isRead: false
    });
  }
}
