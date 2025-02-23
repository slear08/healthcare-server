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
      enum: ['waiting', 'in-progress', 'completed', 'cancelled'],
      default: 'waiting',
    },
    purpose: {
      type: String,
      enum: ['checkup', 'medicine-request'],
    },
    timeSchedule: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const MedicalQueue = mongoose.model('MedicalQueue', MedicalQueueSchema);

export default MedicalQueue;
