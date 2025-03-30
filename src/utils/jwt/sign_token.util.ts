import jwt, { SignOptions } from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from './constant/secrets.constant';
import { JWTPayload } from './interface/jwt_payload.interface';

export const SignJWT = (
  payload: JWTPayload,
  options: SignOptions = {}
): string => {
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, {
    expiresIn: JWT_EXPIRES_IN,
    ...options,
  });
};
