import mongoose from 'mongoose';
import ChildBlog from '../models/ChildBlog';
import ParentBlog from '../models/ParentBlog';
import Tag from '../models/Tag';
import User from '../models/User';

export class SearchService {
  static async searchBlogs(filters: {
    query?: string;
    tags?: string[];
    authorId?: string;
    parentId?: string;
    publishedOnly?: boolean;
    sortBy?: 'date' | 'views' | 'title';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      query,
      tags,
      authorId,
      parentId,
      publishedOnly = true,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (publishedOnly) {
      where.isPublished = true;
    }

    if (parentId) {
      where.parentId = new mongoose.Types.ObjectId(parentId);
    }

    if (authorId) {
      where.authorId = new mongoose.Types.ObjectId(authorId);
    }

    if (query) {
      where.$text = { $search: query };
    }

    let sortOptions: any = {};
    switch (sortBy) {
      case 'views':
        sortOptions = { views: sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'title':
        sortOptions = { title: sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'date':
      default:
        sortOptions = { publishedAt: sortOrder === 'desc' ? -1 : 1 };
        break;
    }

    // Build tag filter
    let tagFilter = {};
    if (tags && tags.length > 0) {
      const tagDocs = await Tag.find({ slug: { $in: tags } });
      const tagIds = tagDocs.map(t => t._id);
      tagFilter = { tags: { $in: tagIds } };
    }

    const [blogs, total] = await Promise.all([
      ChildBlog.find({ ...where, ...tagFilter })
        .populate('parentId', 'title slug')
        .populate('authorId', 'username profileImage')
        .populate('tags', 'name slug color')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      ChildBlog.countDocuments({ ...where, ...tagFilter })
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

  static async getRelatedPosts(blogId: string, limit: number = 3) {
    const blog = await ChildBlog.findById(blogId).populate('tags', '_id');
    
    if (!blog || !blog.tags || blog.tags.length === 0) {
      return [];
    }

    const tagIds = blog.tags.map(tag => tag._id);

    return await ChildBlog.find({
      _id: { $ne: new mongoose.Types.ObjectId(blogId) },
      isPublished: true,
      tags: { $in: tagIds }
    })
      .sort({ views: -1 })
      .limit(limit)
      .populate('parentId', 'title slug')
      .populate('authorId', 'username profileImage')
      .populate('tags', 'name slug color')
      .lean();
  }
}