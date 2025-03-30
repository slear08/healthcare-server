import jwt, { SignOptions } from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from './constant/secrets.constant';
import { JWTPayload } from './interface/jwt_payload.interface';

export const SignJWT = (
  payload: JWTPayload,
  options: SignOptions = {}
): string => {
  const signOptions: SignOptions = {
    ...options,
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign(payload, JWT_SECRET, signOptions);
};
