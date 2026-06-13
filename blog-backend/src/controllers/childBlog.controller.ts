import { Request, Response, NextFunction } from 'express';
import { ChildBlogService } from '../services/childBlog.service';

export const ChildBlogController = {
  // Get all child blogs with filters (public)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        query: req.query.search as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        authorId: req.query.authorId as string,
        parentId: req.query.parentId as string,
        publishedOnly: req.query.status !== 'draft',
        sortBy: (req.query.sort as 'date' | 'views' | 'title') || 'date',
        sortOrder: (req.query.order as 'asc' | 'desc') || 'desc',
        page: req.query.page as any, // already transformed by Zod to number
        limit: req.query.limit as any // already transformed by Zod to number
      };

      const result = await ChildBlogService.getAll(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // Get single child blog by slug (public)
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const clientIp = req.ip;
      const userAgent = req.headers['user-agent'];
      const referrer = req.headers.referer;

      const result = await ChildBlogService.getBySlug(slug, clientIp, userAgent, referrer);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // Create child blog (admin only)
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?._id;
      const childBlog = await ChildBlogService.create(userId.toString(), req.body);
      res.status(201).json(childBlog);
    } catch (error) {
      next(error);
    }
  },

  // Update child blog (admin only)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      const userRole = (req as any).user?.role;
      const updatedBlog = await ChildBlogService.update(id, userId.toString(), userRole, req.body);
      res.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  },

  // Delete child blog (admin only)
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      const userRole = (req as any).user?.role;
      await ChildBlogService.delete(id, userId.toString(), userRole);
      res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Get child blogs for admin dashboard
  async getAdminList(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        page: req.query.page as any, // already transformed by Zod to number
        limit: req.query.limit as any, // already transformed by Zod to number
        search: req.query.search as string,
        parentId: req.query.parentId as string,
        status: req.query.status as string
      };

      const result = await ChildBlogService.getAdminList(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // Increment views
  async incrementViews(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ChildBlogService.incrementViews(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};