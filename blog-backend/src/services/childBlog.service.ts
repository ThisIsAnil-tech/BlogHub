import mongoose from 'mongoose';
import ChildBlog from '../models/ChildBlog';
import ParentBlog from '../models/ParentBlog';
import Tag from '../models/Tag';
import Comment from '../models/Comment';
import Notification from '../models/Notification';
import { SearchService } from './search.service';
import { AnalyticsService } from './analytics.service';
import { EmailService } from './email.service';
import User from '../models/User';
import { NotFoundError, AuthorizationError, ValidationError } from '../utils/errors';

export class ChildBlogService {
  static async getAll(filters: any) {
    return await SearchService.searchBlogs(filters);
  }

  static async getBySlug(slug: string, ipAddress?: string, userAgent?: string, referrer?: string) {
    const childBlog = await ChildBlog.findOne({ slug, isPublished: true })
      .populate('parentId', 'id title slug description')
      .populate('authorId', 'id username profileImage bio socialLinks')
      .populate('tags', 'id name slug color');

    if (!childBlog) {
      throw new NotFoundError('Blog not found');
    }

    // Async tracking of view (non-blocking for response)
    AnalyticsService.trackView(childBlog._id.toString(), {
      ipAddress,
      userAgent,
      referrer
    }).catch(err => {
      // Log errors safely without breaking response
      import('../config/logger').then(l => l.logger.error('View tracking failed', err));
    });

    // Get related posts
    const relatedPosts = await SearchService.getRelatedPosts(childBlog._id.toString());

    // Fetch top-level approved comments with approved replies
    const comments = await Comment.find({
      blogId: childBlog._id,
      isApproved: true,
      parentId: null
    })
      .sort({ createdAt: -1 })
      .lean();

    for (const comment of comments) {
      (comment as any).replies = await Comment.find({
        parentId: comment._id,
        isApproved: true
      })
        .sort({ createdAt: 1 })
        .lean();
    }

    return {
      ...childBlog.toJSON(),
      comments,
      relatedPosts
    };
  }

  static async create(authorId: string, data: any) {
    const {
      parentId,
      title,
      content,
      excerpt,
      featuredImage,
      isPublished,
      metaTitle,
      metaDescription,
      tags
    } = data;

    // Check parent blog existence
    const parent = await ParentBlog.findById(parentId);
    if (!parent) {
      throw new NotFoundError('Parent blog not found');
    }

    // Start MongoDB session for transactions
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const wordsPerMinute = 200;
      const words = content.split(/\s+/).length;
      const readTime = Math.ceil(words / wordsPerMinute);

      const [childBlog] = await ChildBlog.create(
        [{
          parentId: new mongoose.Types.ObjectId(parentId),
          title,
          slug,
          content,
          excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
          featuredImage,
          isPublished: isPublished || false,
          readTime,
          authorId: new mongoose.Types.ObjectId(authorId),
          metaTitle,
          metaDescription,
          publishedAt: isPublished ? new Date() : null,
          tags: tags ? tags.map((tId: string) => new mongoose.Types.ObjectId(tId)) : []
        }],
        { session }
      );

      // Create internal Notification if published
      if (isPublished) {
        await Notification.create(
          [{
            type: 'blog_published',
            userId: new mongoose.Types.ObjectId(authorId),
            title: 'Blog Published',
            message: `Your blog "${title}" has been published.`,
            data: { blogId: childBlog._id },
            isRead: false
          }],
          { session }
        );
      }

      await session.commitTransaction();

      // Retrieve author's email outside transaction to send publication email
      if (isPublished) {
        const author = await User.findById(authorId);
        if (author && author.email) {
          const emailService = new EmailService();
          const template = emailService.getBlogPublishedTemplate(childBlog.toJSON(), author);
          emailService.sendEmail(author.email, template).catch(err => {
            import('../config/logger').then(l => l.logger.error('Failed to send publishing email', err));
          });
        }
      }

      const populatedBlog = await ChildBlog.findById(childBlog._id)
        .populate('parentId', 'id title slug')
        .populate('authorId', 'id username profileImage')
        .populate('tags', 'id name slug color');

      return populatedBlog;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async update(id: string, authorId: string, role: string, data: any) {
    const childBlog = await ChildBlog.findById(id);
    if (!childBlog) {
      throw new NotFoundError('Blog not found');
    }

    // Authorize updates
    if (childBlog.authorId.toString() !== authorId && role !== 'admin') {
      throw new AuthorizationError('Not authorized to update this blog');
    }

    const {
      parentId,
      title,
      content,
      excerpt,
      featuredImage,
      isPublished,
      metaTitle,
      metaDescription,
      tags
    } = data;

    // Start MongoDB session for transactions
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wasPublished = childBlog.isPublished;
      const nowPublished = isPublished !== undefined ? isPublished : childBlog.isPublished;

      if (parentId) {
        const parent = await ParentBlog.findById(parentId);
        if (!parent) {
          throw new NotFoundError('Parent blog not found');
        }
        childBlog.parentId = new mongoose.Types.ObjectId(parentId);
      }

      if (title && title !== childBlog.title) {
        childBlog.title = title;
        childBlog.slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      if (content) {
        childBlog.content = content;
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        childBlog.readTime = Math.ceil(words / wordsPerMinute);
        if (!excerpt) {
          childBlog.excerpt = content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
        }
      }

      if (excerpt !== undefined) childBlog.excerpt = excerpt;
      if (featuredImage !== undefined) childBlog.featuredImage = featuredImage;
      if (isPublished !== undefined) childBlog.isPublished = isPublished;
      if (metaTitle !== undefined) childBlog.metaTitle = metaTitle;
      if (metaDescription !== undefined) childBlog.metaDescription = metaDescription;
      
      if (tags) {
        childBlog.tags = tags.map((tId: string) => new mongoose.Types.ObjectId(tId));
      }

      if (!wasPublished && nowPublished) {
        childBlog.publishedAt = new Date();
      }

      await childBlog.save({ session });

      // Create internal notification if just published
      if (!wasPublished && nowPublished) {
        await Notification.create(
          [{
            type: 'blog_published',
            userId: new mongoose.Types.ObjectId(childBlog.authorId.toString()),
            title: 'Blog Published',
            message: `Your blog "${childBlog.title}" has been published.`,
            data: { blogId: childBlog._id },
            isRead: false
          }],
          { session }
        );
      }

      await session.commitTransaction();

      // Send email if just published
      if (!wasPublished && nowPublished) {
        const author = await User.findById(childBlog.authorId);
        if (author && author.email) {
          const emailService = new EmailService();
          const template = emailService.getBlogPublishedTemplate(childBlog.toJSON(), author);
          emailService.sendEmail(author.email, template).catch(err => {
            import('../config/logger').then(l => l.logger.error('Failed to send publishing email', err));
          });
        }
      }

      const populatedBlog = await ChildBlog.findById(id)
        .populate('parentId', 'id title slug')
        .populate('authorId', 'id username profileImage')
        .populate('tags', 'id name slug color');

      return populatedBlog;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async delete(id: string, authorId: string, role: string) {
    const childBlog = await ChildBlog.findById(id);
    if (!childBlog) {
      throw new NotFoundError('Blog not found');
    }

    if (childBlog.authorId.toString() !== authorId && role !== 'admin') {
      throw new AuthorizationError('Not authorized to delete this blog');
    }

    // Start MongoDB session for transactions
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete child blog
      await ChildBlog.deleteOne({ _id: id }).session(session);
      // Delete associated comments
      await Comment.deleteMany({ blogId: id }).session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getAdminList(filters: {
    page: number;
    limit: number;
    search?: string;
    parentId?: string;
    status?: string;
  }) {
    const { page, limit, search, parentId, status } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (parentId) {
      where.parentId = new mongoose.Types.ObjectId(parentId);
    }

    if (status === 'published') {
      where.isPublished = true;
    } else if (status === 'draft') {
      where.isPublished = false;
    }

    const [blogs, total] = await Promise.all([
      ChildBlog.find(where)
        .populate('parentId', 'id title slug')
        .populate('authorId', 'id username')
        .populate('tags', 'id name slug color')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ChildBlog.countDocuments(where)
    ]);

    return {
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async incrementViews(id: string) {
    const childBlog = await ChildBlog.findById(id);
    if (!childBlog) {
      throw new NotFoundError('Blog not found');
    }

    childBlog.views += 1;
    await childBlog.save();
    return { views: childBlog.views };
  }
}
