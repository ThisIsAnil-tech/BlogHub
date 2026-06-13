import mongoose from 'mongoose';
import Comment from '../models/Comment';
import ChildBlog from '../models/ChildBlog';
import Notification from '../models/Notification';
import { EmailService } from './email.service';
import { NotFoundError, ValidationError } from '../utils/errors';
import { sanitizeHTML } from '../utils/helpers';

export class CommentService {
  static async getByBlog(blogId: string, includeReplies = true) {
    const comments = await Comment.find({
      blogId: new mongoose.Types.ObjectId(blogId),
      isApproved: true,
      parentId: null
    })
      .sort({ createdAt: -1 })
      .lean();

    if (includeReplies) {
      for (const comment of comments) {
        (comment as any).replies = await Comment.find({
          parentId: comment._id,
          isApproved: true
        })
          .sort({ createdAt: 1 })
          .lean();
      }
    }

    return comments;
  }

  static async create(blogId: string, data: any) {
    const { name, email, content, parentId } = data;

    // Spam and profanity keyword filters
    const SPAM_KEYWORDS = ['buy cheap', 'casino', 'viagra', 'porn', 'free traffic', 'seo ranking', 'make money online', 'invest in bitcoin', 'lottery winner', 'cheap deals'];
    const PROFANITY_WORDS = ['fuck', 'shit', 'asshole', 'bitch', 'cunt'];
    
    const combinedText = `${name} ${content}`.toLowerCase();
    for (const word of SPAM_KEYWORDS) {
      if (combinedText.includes(word)) {
        throw new ValidationError('Comment rejected: flagged as spam.');
      }
    }
    for (const word of PROFANITY_WORDS) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(combinedText)) {
        throw new ValidationError('Comment rejected: inappropriate language detected.');
      }
    }

    // Check blog existence
    const blog = await ChildBlog.findById(blogId);
    if (!blog) {
      throw new NotFoundError('Blog post not found');
    }

    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        throw new NotFoundError('Parent comment not found');
      }
      if (parentComment.blogId.toString() !== blogId) {
        throw new ValidationError('Parent comment does not belong to this blog');
      }
    }

    // HTML Sanitization on name and content inputs
    const sanitizedName = sanitizeHTML(name);
    const sanitizedContent = sanitizeHTML(content);

    if (!sanitizedName || !sanitizedContent) {
      throw new ValidationError('Comment content cannot be empty after sanitization.');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [comment] = await Comment.create(
        [{
          blogId: new mongoose.Types.ObjectId(blogId),
          parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
          name: sanitizedName,
          email,
          content: sanitizedContent,
          isApproved: false // Requires admin approval by default
        }],
        { session }
      );

      // Create notification for admin/author about pending comment
      await Notification.create(
        [{
          type: 'new_comment',
          userId: new mongoose.Types.ObjectId(blog.authorId.toString()),
          title: 'Pending Comment',
          message: `New comment on your blog "${blog.title}" by ${sanitizedName} is awaiting approval.`,
          data: { commentId: comment._id, blogId: blog._id },
          isRead: false
        }],
        { session }
      );

      await session.commitTransaction();

      // Send email notification to admin/author (non-blocking)
      const emailService = new EmailService();
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@blog.com';
      const template = emailService.getNewCommentTemplate(comment.toJSON(), blog.toJSON());
      emailService.sendEmail(adminEmail, template).catch(err => {
        import('../config/logger').then(l => l.logger.error('Failed to send comment notification email', err));
      });

      return comment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getAdminList(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find()
        .populate('blogId', 'id title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments()
    ]);

    return {
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async approve(id: string) {
    const comment = await Comment.findById(id);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    comment.isApproved = true;
    await comment.save();
    return comment;
  }

  static async delete(id: string) {
    const comment = await Comment.findById(id);
    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Comment.deleteOne({ _id: id }).session(session);
      await Comment.deleteMany({ parentId: id }).session(session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async bulkApprove(commentIds: string[]) {
    const ids = commentIds.map(id => new mongoose.Types.ObjectId(id));
    await Comment.updateMany(
      { _id: { $in: ids } },
      { $set: { isApproved: true } }
    );
  }

  static async bulkDelete(commentIds: string[]) {
    const ids = commentIds.map(id => new mongoose.Types.ObjectId(id));
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await Comment.deleteMany({ _id: { $in: ids } }).session(session);
      await Comment.deleteMany({ parentId: { $in: ids } }).session(session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
export default CommentService;
