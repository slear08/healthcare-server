import { Document, model, Schema } from 'mongoose';

import USER_TYPE from '../constant/user_type.constant';

interface UserInterface extends Document {
  _id: string;
  name: string;
  email: string;
  role: USER_TYPE.ADMIN | USER_TYPE.USER;
  profile: string;
  password?: string;
  deletedAt?: Date | null;
}

const UserSchema = new Schema<UserInterface>(
  {
    _id: {
      type: String,
      default: () =>
        `AD_${Date.now().toString().slice(-5)}_${Math.random().toString(36).slice(2, 8)}`,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profile: {
      type: String,
      trim: true,
      validate: {
        validator: function (this: UserInterface, value: string) {
          return this.role !== USER_TYPE.USER || !!value;
        },
        message: 'Password is required for admin users',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: [USER_TYPE.ADMIN, USER_TYPE.USER],
    },
    password: {
      type: String,
      trim: true,
      validate: {
        validator: function (this: UserInterface, value: string) {
          return this.role !== USER_TYPE.ADMIN || !!value;
        },
        message: 'Password is required for admin users',
      },
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = model<UserInterface>('User', UserSchema);

UserSchema.pre<UserInterface>('save', function (next) {
  if (this.role !== USER_TYPE.ADMIN) {
    delete this.password;
  }
  next();
});

export default User;
export type { UserInterface };
