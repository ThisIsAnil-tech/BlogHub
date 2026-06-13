import { Request, Response, NextFunction } from 'express';
import { TagService } from '../services/tag.service';

export const TagController = {
  // Get all tags (public)
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const popular = req.query.popular === 'true';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      const tags = await TagService.getAll(popular, limit);
      res.json(tags);
    } catch (error) {
      next(error);
    }
  },

  // Get tag by slug (public)
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const page = req.query.page as any; // already parsed/transformed by Zod to number
      const limit = req.query.limit as any; // already parsed/transformed by Zod to number

      const result = await TagService.getBySlug(slug, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // Create tag (admin only)
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tag = await TagService.create(req.body);
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  },

  // Update tag (admin only)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tag = await TagService.update(id, req.body);
      res.json(tag);
    } catch (error) {
      next(error);
    }
  },

  // Delete tag (admin only)
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await TagService.delete(id);
      res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // Get tags cloud (public)
  async getCloud(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const weightedTags = await TagService.getCloud(limit);
      res.json(weightedTags);
    } catch (error) {
      next(error);
    }
  }
};
