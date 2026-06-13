import mongoose, { Schema, Document } from 'mongoose';
import { ITag } from './Tag';

export interface IParentBlog extends Document {
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  authorId: mongoose.Types.ObjectId;
  tags: ITag['_id'][];
  createdAt: Date;
  updatedAt: Date;
}

const ParentBlogSchema = new Schema<IParentBlog>(
  {
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
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    imageUrl: {
      type: String
    },
    order: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    metaTitle: {
      type: String,
      maxlength: [200, 'Meta title cannot exceed 200 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [500, 'Meta description cannot exceed 500 characters']
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
ParentBlogSchema.index({ slug: 1 });
ParentBlogSchema.index({ isPublished: 1 });
ParentBlogSchema.index({ order: 1 });
ParentBlogSchema.index({ authorId: 1 });

// Virtual for child blogs count
ParentBlogSchema.virtual('childrenCount', {
  ref: 'ChildBlog',
  localField: '_id',
  foreignField: 'parentId',
  count: true
});

// Virtual for children blogs
ParentBlogSchema.virtual('children', {
  ref: 'ChildBlog',
  localField: '_id',
  foreignField: 'parentId',
  options: { sort: { publishedAt: -1 }, match: { isPublished: true } }
});

// Generate slug before saving
ParentBlogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model<IParentBlog>('ParentBlog', ParentBlogSchema);