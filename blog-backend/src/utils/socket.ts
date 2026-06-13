import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';
import logger from '../config/logger';

const setupSocket = (io: Server) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        // Allow anonymous connections for public features (viewing posts, comments)
        socket.data.user = null;
        return next();
      }

      const secret = process.env.JWT_SECRET || 'your-fallback-secret-key-for-dev-only';
      const decoded = jwt.verify(token, secret) as { userId: string; role: string };
      
      if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
        return next(new Error('Authentication error: Invalid userId'));
      }

      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      logger.warn('Socket authentication failure:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket client connected: ${socket.id}`);
    const user = socket.data.user;

    // Join user to their personal room for notifications
    if (user) {
      const userIdStr = user._id.toString();
      socket.join(`user:${userIdStr}`);
      
      // Join admin room ONLY if they are admin (fixes admin privilege leak!)
      if (user.role === 'admin') {
        socket.join('admin');
        logger.info(`Admin joined admin room: ${user.username}`);
      }
    }

    // Join blog rooms for live comments (Validate blogId)
    socket.on('join-blog', (blogId: string) => {
      if (mongoose.Types.ObjectId.isValid(blogId)) {
        socket.join(`blog:${blogId}`);
      } else {
        logger.warn(`Invalid blogId in join-blog socket event from client: ${socket.id}`);
      }
    });

    // Leave blog rooms (Validate blogId)
    socket.on('leave-blog', (blogId: string) => {
      if (mongoose.Types.ObjectId.isValid(blogId)) {
        socket.leave(`blog:${blogId}`);
      }
    });

    // Handle new comments (Validate blogId and authenticate comment emissions)
    socket.on('new-comment', (data: { blogId: string; comment: any }) => {
      if (!data || !mongoose.Types.ObjectId.isValid(data.blogId)) {
        logger.warn(`Invalid parameters in new-comment event from client: ${socket.id}`);
        return;
      }
      
      // Broadcast to everyone in the blog room (except sender)
      socket.to(`blog:${data.blogId}`).emit('comment-added', data.comment);
      
      // Notify admin room about new comment
      io.to('admin').emit('admin-notification', {
        type: 'new_comment',
        data: data.comment
      });
    });

    // Handle comment approval (Validate parameters and authorize sender is admin)
    socket.on('comment-approved', (data: { blogId: string; commentId: string }) => {
      // Authorization Check (event spoofing prevention)
      if (user?.role !== 'admin') {
        logger.warn(`Unauthorized comment-approved event attempt by user ${user?.username || 'Anonymous'} on client ${socket.id}`);
        return;
      }

      if (
        !data ||
        !mongoose.Types.ObjectId.isValid(data.blogId) ||
        !mongoose.Types.ObjectId.isValid(data.commentId)
      ) {
        logger.warn(`Invalid parameters in comment-approved event from admin client: ${socket.id}`);
        return;
      }

      io.to(`blog:${data.blogId}`).emit('comment-updated', {
        commentId: data.commentId,
        status: 'approved'
      });
    });

    // Handle live analytics updates (Verify user is admin)
    if (user?.role === 'admin') {
      socket.on('subscribe-analytics', () => {
        socket.join('analytics');
      });

      socket.on('unsubscribe-analytics', () => {
        socket.leave('analytics');
      });
    }

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`Socket client disconnected: ${socket.id}`);
    });
  });
};

// Function to send notifications
export const sendNotification = (io: Server, userId: string, notification: any) => {
  if (mongoose.Types.ObjectId.isValid(userId)) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};

// Function to broadcast to admin
export const notifyAdmin = (io: Server, notification: any) => {
  io.to('admin').emit('admin-notification', notification);
};

// Function to update analytics in real-time
export const updateAnalytics = (io: Server, data: any) => {
  io.to('analytics').emit('analytics-update', data);
};

export { setupSocket };
