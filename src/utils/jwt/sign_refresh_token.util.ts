import jwt from 'jsonwebtoken';
import { JWTPayload } from './interface/jwt_payload.interface';
import {
  REFRESH_EXPIRES_IN,
  REFRESH_SECRET,
} from './constant/secrets.constant';

export const SignRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};
