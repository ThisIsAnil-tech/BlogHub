import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    userAgent: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically delete expired sessions from the database
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Index by token hash for fast lookup
SessionSchema.index({ tokenHash: 1 });
// Index by userId for revoking user sessions
SessionSchema.index({ userId: 1 });

export default mongoose.model<ISession>('Session', SessionSchema);
