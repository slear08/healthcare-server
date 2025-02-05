import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../utils/http-error';

export const PassportAuthMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return next(new HttpError(401, 'User is not authenticated'));
};
