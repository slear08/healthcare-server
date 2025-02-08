import { NextFunction, Request, Response } from 'express';

import USER_TYPE from '../../constant/user_type.constant';
import { HttpError } from '../../utils/http-error';
import { VerifyJWT } from '../../utils/jwt/verify_token.util';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const AuthMiddleware = (
  req: AuthRequest,
  _: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new HttpError(401, 'Authorization token is required'));
  }

  const decoded = VerifyJWT(token);

  if (decoded?.role == USER_TYPE.ADMIN) {
    return next(new HttpError(401, 'Unauthorized access'));
  }

  if (!decoded) {
    return next(new HttpError(403, 'Invalid or expired token'));
  }

  req.admin = {
    ...decoded,
    id: decoded.id,
  };

  next();
};
