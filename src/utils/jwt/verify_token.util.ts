import jwt, { VerifyErrors } from 'jsonwebtoken';

import log from '../logger';
import { JWTPayload } from './interface/jwt_payload.interface';
import { JWT_SECRET } from './constant/secrets.constant';

export const VerifyJWT = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    log.error(`JWT verification error: ${(error as VerifyErrors).message}`);
    return null;
  }
};
