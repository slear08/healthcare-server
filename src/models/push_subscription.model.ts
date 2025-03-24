import mongoose, { Document } from 'mongoose';
import { PushSubscription } from 'web-push';

export interface IPushSubscription extends Document {
  userId: string;
  subscription: PushSubscription;
  createdAt: Date;
  updatedAt: Date;
}

const PushSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: 'User',
    },
    subscription: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const PushSubscription = mongoose.model<IPushSubscription>(
  'PushSubscription',
  PushSubscriptionSchema
);

export default PushSubscription;
