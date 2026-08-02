import mongoose, { Schema, Document } from 'mongoose';

export interface IAppraisal extends Document {
  userId: string; // references Clerk ID or User collection
  deviceName: string;
  category: string;
  condition: string;
  conditionDetails?: string;
  estimatedValue: number;
  lowEstimate: number;
  highEstimate: number;
  recommendation: string;
  recommendationReason?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppraisalSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    deviceName: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    conditionDetails: { type: String, required: false },
    estimatedValue: { type: Number, required: true },
    lowEstimate: { type: Number, required: true },
    highEstimate: { type: Number, required: true },
    recommendation: { type: String, required: true },
    recommendationReason: { type: String, required: false },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Appraisal || mongoose.model<IAppraisal>('Appraisal', AppraisalSchema);
