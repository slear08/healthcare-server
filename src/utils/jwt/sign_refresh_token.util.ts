import jwt, { SignOptions } from 'jsonwebtoken';

import {
  REFRESH_EXPIRES_IN,
  REFRESH_SECRET,
} from './constant/secrets.constant';
import { JWTPayload } from './interface/jwt_payload.interface';

export const SignRefreshToken = (payload: JWTPayload): string => {
  const signOptions: SignOptions = {
    expiresIn: REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload, REFRESH_SECRET, signOptions);
};
