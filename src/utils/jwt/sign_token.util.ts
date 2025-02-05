import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload } from './interface/jwt_payload.interface';
import { JWT_EXPIRES_IN, JWT_SECRET } from './constant/secrets.constant';

export const SignJWT = (
  payload: JWTPayload,
  options: SignOptions = {}
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    ...options,
  });
};
