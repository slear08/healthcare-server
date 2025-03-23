import User from '../../models/user.model';
import { HttpError } from '../../utils/http-error';

interface VerifyUserRequest {
  userId: string;
  name: string;
  mobileNumber: string;
}

export const verifyUserService = async ({
  userId,
  name,
  mobileNumber,
}: VerifyUserRequest) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  user.name = name;
  user.mobileNumber = mobileNumber;
  user.isVerified = true;
  await user.save();

  return {
    message: 'Setup completed successfully',
    user: {
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      isVerified: user.isVerified,
    },
  };
};
