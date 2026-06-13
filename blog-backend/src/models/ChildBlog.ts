import mongoose, { Schema, Document } from 'mongoose';
import { ITag } from './Tag';
import { IUser } from './User';
import { IParentBlog } from './ParentBlog';

export interface IChildBlog extends Document {
  parentId: mongoose.Types.ObjectId | IParentBlog;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  isPublished: boolean;
  views: number;
  readTime: number;
  authorId: mongoose.Types.ObjectId | IUser;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date;
  tags: ITag['_id'][];
  createdAt: Date;
  updatedAt: Date;
}

const ChildBlogSchema = new Schema<IChildBlog>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'ParentBlog',
      required: [true, 'Parent blog is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Please enter a valid slug']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters']
    },
    featuredImage: {
      type: String
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    readTime: {
      type: Number,
      default: 5
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    metaTitle: {
      type: String,
      maxlength: [200, 'Meta title cannot exceed 200 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [500, 'Meta description cannot exceed 500 characters']
    },
    publishedAt: {
      type: Date
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
ChildBlogSchema.index({ slug: 1 });
ChildBlogSchema.index({ parentId: 1 });
ChildBlogSchema.index({ isPublished: 1 });
ChildBlogSchema.index({ publishedAt: -1 });
ChildBlogSchema.index({ views: -1 });
ChildBlogSchema.index({ authorId: 1 });
ChildBlogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Auto-generate slug
ChildBlogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Set publishedAt when publishing
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Generate excerpt from content
  if (this.isModified('content') && !this.excerpt) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 200) + '...';
  }
  
  // Calculate read time
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const words = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(words / wordsPerMinute);
  }
  
  next();
});

// Virtual for comments
ChildBlogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blogId'
});

// Virtual for author
ChildBlogSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// Virtual for parent
ChildBlogSchema.virtual('parent', {
  ref: 'ParentBlog',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model<IChildBlog>('ChildBlog', ChildBlogSchema);