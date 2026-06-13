import mongoose from 'mongoose';
import ChildBlog from '../models/ChildBlog';
import BlogView from '../models/BlogView';
import Comment from '../models/Comment';
import User from '../models/User';
import ParentBlog from '../models/ParentBlog';

export class AnalyticsService {
  static async getAnalytics(startDate: Date, endDate: Date) {
    // Total counts
    const [totalViews, totalBlogs, totalComments] = await Promise.all([
      BlogView.countDocuments(),
      ChildBlog.countDocuments({ isPublished: true }),
      Comment.countDocuments({ isApproved: true })
    ]);

    // Views by date
    const viewsByDate = await BlogView.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Popular blogs
    const popularBlogs = await ChildBlog.find({ isPublished: true })
      .sort({ views: -1 })
      .limit(10)
      .select('id title slug views publishedAt')
      .lean();

    // Traffic sources
    const trafficSources = await BlogView.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: ['$referrer', null] }, then: 'Direct' },
                { case: { $regexMatch: { input: '$referrer', regex: /google/ } }, then: 'Google' },
                { case: { $regexMatch: { input: '$referrer', regex: /facebook/ } }, then: 'Facebook' },
                { case: { $regexMatch: { input: '$referrer', regex: /twitter/ } }, then: 'Twitter' },
                { case: { $regexMatch: { input: '$referrer', regex: /linkedin/ } }, then: 'LinkedIn' }
              ],
              default: 'Other Referral'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Country stats
    const countryStats = await BlogView.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          country: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return {
      totalViews,
      totalBlogs,
      totalComments,
      viewsByDay: viewsByDate.map(v => ({ date: v._id, count: v.count })),
      popularBlogs,
      trafficSources: trafficSources.map(t => ({ source: t._id, count: t.count })),
      countryStats: countryStats.map(c => ({ country: c._id, count: c.count }))
    };
  }

  static async getActiveUsers(minutes: number = 5): Promise<number> {
    const timeAgo = new Date(Date.now() - minutes * 60 * 1000);
    const result = await BlogView.distinct('ipAddress', {
      createdAt: { $gt: timeAgo }
    });
    return result.length;
  }

  static async getViewsSince(date: Date): Promise<number> {
    return await BlogView.countDocuments({
      createdAt: { $gt: date }
    });
  }

  static async getNewCommentsCount(): Promise<number> {
    return await Comment.countDocuments({ isApproved: false });
  }

  static async getPopularBlogsSince(date: Date, limit: number = 10) {
    return await ChildBlog.find({
      isPublished: true,
      publishedAt: { $gte: date }
    })
      .sort({ views: -1 })
      .limit(limit)
      .populate('parentId', 'title slug')
      .populate('authorId', 'username profileImage')
      .lean();
  }

  static async trackView(blogId: string, data: {
    ipAddress?: string;
    userAgent?: string;
    country?: string;
    referrer?: string;
  }) {
    await BlogView.create({
      blogId: new mongoose.Types.ObjectId(blogId),
      ...data
    });

    await ChildBlog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
  }
}