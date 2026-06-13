import mongoose, { Schema, Document } from 'mongoose';
import { IChildBlog } from './ChildBlog';

export interface IComment extends Document {
  blogId: mongoose.Types.ObjectId | IChildBlog;
  parentId?: mongoose.Types.ObjectId | IComment;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'ChildBlog',
      required: [true, 'Blog ID is required']
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters']
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes
CommentSchema.index({ blogId: 1 });
CommentSchema.index({ parentId: 1 });
CommentSchema.index({ isApproved: 1 });
CommentSchema.index({ createdAt: -1 });
CommentSchema.index({ email: 1 });

// Virtual for replies
CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId'
});

// Virtual for blog
CommentSchema.virtual('blog', {
  ref: 'ChildBlog',
  localField: 'blogId',
  foreignField: '_id',
  justOne: true
});

export default mongoose.model<IComment>('Comment', CommentSchema);