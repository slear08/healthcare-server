import mongoose, { Document } from 'mongoose';

export interface IMedicineReminder extends Document {
  name: string;
  numberToTake: number;
  isEveryday: boolean;
  time: string; // Time of day for the reminder
  reminderDate?: string; // Optional, only used if isEveryday is false
  userId: string; // User who set the reminder
}

const MedicineReminderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    numberToTake: {
      type: Number,
      required: true,
    },
    isEveryday: {
      type: Boolean,
      default: true,
    },
    time: {
      type: String,
      required: true,
    },
    reminderDate: {
      type: Date,
      required: function () {
        return !(this as IMedicineReminder).isEveryday;
      },
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const MedicineReminder = mongoose.model<IMedicineReminder>(
  'MedicineReminder',
  MedicineReminderSchema
);

export default MedicineReminder;
