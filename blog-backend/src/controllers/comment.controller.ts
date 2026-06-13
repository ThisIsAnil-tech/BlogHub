import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/comment.service';

export const CommentController = {
  // Get comments by blog ID (public)
  async getByBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogId } = req.params;
      const includeReplies = req.query.includeReplies !== 'false';
      const comments = await CommentService.getByBlog(blogId, includeReplies);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  },

  // Create new comment (public)
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { blogId } = req.params;
      const comment = await CommentService.create(blogId, req.body);
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  },

  // Get comments list for admin dashboard
  async getAdminList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page as any; // parsed/transformed by Zod to number
      const limit = req.query.limit as any; // parsed/transformed by Zod to number

      const result = await CommentService.getAdminList(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // Approve a comment (admin only)
  async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const comment = await CommentService.approve(id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  },

  // Delete a comment (admin only)
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await CommentService.delete(id);
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Bulk approve comments (admin only)
  async bulkApprove(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentIds } = req.body;
      await CommentService.bulkApprove(commentIds);
      res.json({ message: 'Comments approved successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Bulk delete comments (admin only)
  async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentIds } = req.body;
      await CommentService.bulkDelete(commentIds);
      res.json({ message: 'Comments deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};