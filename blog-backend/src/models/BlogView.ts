import mongoose, { Schema, Document } from 'mongoose';
import { IChildBlog } from './ChildBlog';

export interface IBlogView extends Document {
  blogId: mongoose.Types.ObjectId | IChildBlog;
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  referrer?: string;
  createdAt: Date;
}

const BlogViewSchema = new Schema<IBlogView>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'ChildBlog',
      required: true
    },
    ipAddress: {
      type: String,
      maxlength: [45, 'IP address is too long']
    },
    userAgent: {
      type: String
    },
    country: {
      type: String,
      uppercase: true,
      maxlength: [2, 'Country code must be 2 characters']
    },
    referrer: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes
BlogViewSchema.index({ blogId: 1 });
BlogViewSchema.index({ createdAt: -1 });
BlogViewSchema.index({ country: 1 });
BlogViewSchema.index({ ipAddress: 1 });

// Virtual for blog
BlogViewSchema.virtual('blog', {
  ref: 'ChildBlog',
  localField: 'blogId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model<IBlogView>('BlogView', BlogViewSchema);