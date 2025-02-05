import bcrypt from 'bcrypt';

import USER_TYPE from '../../constant/user_type.constant';
import User from '../../models/user.model';
import { HttpError } from '../../utils/http-error';

export const registerUserService = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(400, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: USER_TYPE.ADMIN,
  });

  await newUser.save();

  return { message: 'User registered successfully' };
};
