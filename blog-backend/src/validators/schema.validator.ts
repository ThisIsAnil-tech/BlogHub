import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodTypeAny } from 'zod';
import mongoose from 'mongoose';
import { ValidationError } from '../utils/errors';

// Helper to validate Mongoose ObjectId
export const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid MongoDB ObjectId' }
);

// Generic Request Validation Middleware
export const validateRequest = (schema: {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        // Zod query parsers should allow string parsing to numbers where appropriate
        req.query = (await schema.query.parseAsync(req.query)) as any;
      }
      if (schema.params) {
        req.params = (await schema.params.parseAsync(req.params)) as any;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
        return next(new ValidationError('Invalid input data', errors));
      }
      next(error);
    }
  };
};

// --- AUTH SCHEMAS ---

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .trim(),
  email: z.string().email('Please enter a valid email').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).trim().optional(),
  email: z.string().email().trim().toLowerCase().optional(),
  bio: z.string().max(500).optional(),
  profileImage: z.string().url().or(z.string().nullable()).optional(),
  socialLinks: z.object({
    twitter: z.string().trim().optional().or(z.literal('')),
    github: z.string().trim().optional().or(z.literal('')),
    linkedin: z.string().trim().optional().or(z.literal('')),
    website: z.string().trim().optional().or(z.literal(''))
  }).optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email').trim().toLowerCase()
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'New password must be at least 6 characters')
});

export const tokenParamSchema = z.object({
  token: z.string().min(1, 'Token parameter is required')
});

export const userIdParamSchema = z.object({
  userId: objectIdSchema
});

export const createParentBlogSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  order: z.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(false),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  tags: z.array(objectIdSchema).optional().default([])
});

export const updateParentBlogSchema = createParentBlogSchema.partial();

// --- CHILD BLOG SCHEMAS ---

export const createChildBlogSchema = z.object({
  parentId: objectIdSchema,
  title: z.string().min(3).max(200).trim(),
  content: z.string().min(1, 'Content cannot be empty'),
  excerpt: z.string().max(300).optional(),
  featuredImage: z.string().url().optional(),
  isPublished: z.boolean().optional().default(false),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  tags: z.array(objectIdSchema).optional().default([])
});

export const updateChildBlogSchema = createChildBlogSchema.partial();

// --- COMMENT SCHEMAS ---

export const createCommentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  content: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
  parentId: objectIdSchema.optional()
});

export const bulkCommentActionSchema = z.object({
  commentIds: z.array(objectIdSchema).min(1, 'At least one comment ID is required')
});

// --- TAG SCHEMAS ---

export const createTagSchema = z.object({
  name: z.string().min(2, 'Tag name must be at least 2 characters').max(50).trim(),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color').optional()
});

export const updateTagSchema = createTagSchema.partial();

// --- COMMON SCHEMAS ---

export const paramIdSchema = z.object({
  id: objectIdSchema
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug parameter is required')
});

export const blogIdParamSchema = z.object({
  blogId: objectIdSchema
});

// Pagination / Query Parameters
export const paginationQuerySchema = z.object({
  page: z.string().optional().default('1').transform((val) => {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }),
  limit: z.string().optional().default('10').transform((val) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed < 1) return 10;
    return parsed > 100 ? 100 : parsed;
  }),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
  status: z.enum(['all', 'published', 'draft']).optional().default('all'),
  parentId: objectIdSchema.optional(),
  tags: z.string().optional() // comma-separated slug list
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email').trim().toLowerCase(),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000)
});
