import jwt, { VerifyErrors } from 'jsonwebtoken';
import { JWTPayload } from './interface/jwt_payload.interface';
import log from '../logger';
import { REFRESH_SECRET } from './constant/secrets.constant';

export const VerifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    log.error(
      `Refresh token verification error: ${(error as VerifyErrors).message}`
    );
    return null;
  }
};
