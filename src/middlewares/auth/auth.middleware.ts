import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../../utils/http-error';
import { VerifyJWT } from '../../utils/jwt/verify_token.util';

export interface AuthRequest extends Request {
  user?: {
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

  if (!decoded) {
    return next(new HttpError(403, 'Invalid or expired token'));
  }

  req.user = {
    ...decoded,
    id: decoded.id,
  };

  next();
};
