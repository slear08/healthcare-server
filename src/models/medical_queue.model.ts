import mongoose, { Document } from 'mongoose';

export interface IMedicalQueue extends Document {
  status: 'waiting' | 'in-progress' | 'completed';
  timeSchedule: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const MedicalQueueSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () =>
        `QUEUE_${Date.now().toString().slice(-5)}_${Math.random().toString(36).slice(2, 8)}`,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'completed'],
      default: 'waiting',
    },
    timeSchedule: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const MedicalQueue = mongoose.model('MedicalQueue', MedicalQueueSchema);

export default MedicalQueue;
