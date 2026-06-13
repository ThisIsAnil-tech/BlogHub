import { Request, Response, NextFunction } from 'express';
import { ParentBlogService } from '../services/parentBlog.service';

export const ParentBlogController = {
  // Get all parent blogs (public)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const publishedOnly = req.query.publishedOnly !== 'false';
      const parentBlogs = await ParentBlogService.getAll(publishedOnly);
      res.json(parentBlogs);
    } catch (error) {
      next(error);
    }
  },

  // Get single parent blog by slug
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const parentBlog = await ParentBlogService.getBySlug(slug);
      res.json(parentBlog);
    } catch (error) {
      next(error);
    }
  },

  // Create parent blog (admin only)
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?._id;
      const parentBlog = await ParentBlogService.create(userId.toString(), req.body);
      res.status(201).json(parentBlog);
    } catch (error) {
      next(error);
    }
  },

  // Update parent blog (admin only)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      const userRole = (req as any).user?.role;
      const updatedParentBlog = await ParentBlogService.update(id, userId.toString(), userRole, req.body);
      res.json(updatedParentBlog);
    } catch (error) {
      next(error);
    }
  },

  // Delete parent blog (admin only)
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      const userRole = (req as any).user?.role;
      await ParentBlogService.delete(id, userId.toString(), userRole);
      res.json({ message: 'Parent blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Get parent blogs for admin dashboard
  async getAdminList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page as any; // already parsed/transformed by Zod to number
      const limit = req.query.limit as any; // already parsed/transformed by Zod to number
      const search = (req.query.search as string) || '';

      const listData = await ParentBlogService.getAdminList(page, limit, search);
      res.json(listData);
    } catch (error) {
      next(error);
    }
  }
};