import bcrypt from 'bcrypt';

import User from '../../models/user.model';
import { HttpError } from '../../utils/http-error';

interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export const changePasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}: ChangePasswordRequest) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password!);
  if (!isPasswordValid) {
    throw new HttpError(401, 'Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};
