import mongoose from 'mongoose';
import Tag from '../models/Tag';
import ChildBlog from '../models/ChildBlog';
import { NotFoundError, ValidationError } from '../utils/errors';

export class TagService {
  static async getAll(popular = false, limit?: number) {
    const aggPipelines: any[] = [];

    // Lookup matching childblogs to count references
    aggPipelines.push({
      $lookup: {
        from: 'childblogs',
        localField: '_id',
        foreignField: 'tags',
        as: 'blogs'
      }
    });

    // Count only published blogs
    aggPipelines.push({
      $addFields: {
        blogCount: {
          $size: {
            $filter: {
              input: '$blogs',
              as: 'blog',
              cond: { $eq: ['$$blog.isPublished', true] }
            }
          }
        }
      }
    });

    // Remove raw blogs array from projection for smaller payload
    aggPipelines.push({
      $project: {
        blogs: 0
      }
    });

    // Sort by popular count or alphabet name
    if (popular) {
      aggPipelines.push({
        $sort: { blogCount: -1, name: 1 }
      });
    } else {
      aggPipelines.push({
        $sort: { name: 1 }
      });
    }

    if (limit && limit > 0) {
      aggPipelines.push({ $limit: limit });
    }

    return await Tag.aggregate(aggPipelines);
  }

  static async getBySlug(slug: string, page: number, limit: number) {
    const tag = await Tag.findOne({ slug });
    if (!tag) {
      throw new NotFoundError('Tag not found');
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      ChildBlog.find({ tags: tag._id, isPublished: true })
        .populate('parentId', 'id title slug')
        .populate('authorId', 'id username profileImage')
        .populate('tags', 'id name slug color')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ChildBlog.countDocuments({ tags: tag._id, isPublished: true })
    ]);

    return {
      tag,
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async create(data: any) {
    const { name, description, color } = data;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingTag = await Tag.findOne({
      $or: [{ name }, { slug }]
    });

    if (existingTag) {
      throw new ValidationError('Tag already exists');
    }

    return await Tag.create({
      name,
      slug,
      description,
      color: color || '#3B82F6'
    });
  }

  static async update(id: string, data: any) {
    const tag = await Tag.findById(id);
    if (!tag) {
      throw new NotFoundError('Tag not found');
    }

    const { name, description, color } = data;

    if (name && name !== tag.name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existingTag = await Tag.findOne({ slug });
      if (existingTag && existingTag._id.toString() !== id) {
        throw new ValidationError('Tag with this name already exists');
      }

      tag.name = name;
      tag.slug = slug;
    }

    if (description !== undefined) tag.description = description;
    if (color !== undefined) tag.color = color;

    await tag.save();
    return tag;
  }

  static async delete(id: string) {
    const tag = await Tag.findById(id);
    if (!tag) {
      throw new NotFoundError('Tag not found');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete Tag
      await Tag.deleteOne({ _id: id }).session(session);
      // Clean up tag reference inside all child blogs (Database Integrity)
      await ChildBlog.updateMany(
        { tags: id },
        { $pull: { tags: id } }
      ).session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getCloud(limit: number) {
    const tags = await Tag.aggregate([
      {
        $lookup: {
          from: 'childblogs',
          localField: '_id',
          foreignField: 'tags',
          as: 'blogs'
        }
      },
      {
        $addFields: {
          count: {
            $size: {
              $filter: {
                input: '$blogs',
                as: 'blog',
                cond: { $eq: ['$$blog.isPublished', true] }
              }
            }
          }
        }
      },
      {
        $project: {
          blogs: 0
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit
      }
    ]);

    if (tags.length === 0) return [];

    const counts = tags.map((t) => t.count || 0);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);

    return tags.map((tag) => {
      const count = tag.count || 0;
      let weight = 1;

      if (maxCount > minCount) {
        weight = 1 + ((count - minCount) / (maxCount - minCount)) * 3;
      }

      return {
        ...tag,
        weight: Math.round(weight * 10) / 10
      };
    });
  }
}
