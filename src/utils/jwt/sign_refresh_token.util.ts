import jwt from 'jsonwebtoken';

import {
  REFRESH_EXPIRES_IN,
  REFRESH_SECRET,
} from './constant/secrets.constant';
import { JWTPayload } from './interface/jwt_payload.interface';

export const SignRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET as jwt.Secret, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
};
