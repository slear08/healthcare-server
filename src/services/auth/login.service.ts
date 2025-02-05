import bcrypt from 'bcrypt';

import User from '../../models/user.model';
import { HttpError } from '../../utils/http-error';
import { JWTPayload } from '../../utils/jwt/interface/jwt_payload.interface';
import { SignRefreshToken } from '../../utils/jwt/sign_refresh_token.util';
import { SignJWT } from '../../utils/jwt/sign_token.util';

export const loginUserService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(400, 'Account does not exist');
  }

  const isMatch = bcrypt.compare(password, user.password!);
  if (!isMatch) {
    throw new HttpError(400, 'Invalid email or password');
  }

  const payload: JWTPayload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = SignJWT(payload);
  const refreshToken = SignRefreshToken(payload);

  return {
    message: 'Logged in successfully',
    user: { name: user.name, role: user.role },
    auth: { token, refreshToken },
  };
};
