import mongoose, { Document } from 'mongoose';

export interface IMedicalQueueLimit extends Document {
  status: 'ON' | 'OFF';
  limit: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const MedicalQueueLimitSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['ON', 'OFF'],
      required: true,
      default: 'ON',
    },
    limit: {
      type: Number,
      required: true,
      default: 30,
      min: 1,
    },
  },
  { timestamps: true }
);

const MedicalQueueLimit = mongoose.model<IMedicalQueueLimit>(
  'MedicalQueueLimit',
  MedicalQueueLimitSchema
);

export default MedicalQueueLimit;
