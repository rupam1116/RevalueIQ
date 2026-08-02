import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'suspended' | 'deleted';
  preferences: {
    notifications: boolean;
    newsletter: boolean;
  };
  lastLogin?: Date;
  isEmailVerified: boolean;
  provider: 'email' | 'google' | 'unknown';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String, required: false },
    role: { type: String, enum: ['admin', 'user', 'moderator'], default: 'user', index: true },
    status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active', index: true },
    preferences: {
      notifications: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
    },
    lastLogin: { type: Date, required: false, index: true },
    isEmailVerified: { type: Boolean, default: false },
    provider: { type: String, enum: ['email', 'google', 'unknown'], default: 'email' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
