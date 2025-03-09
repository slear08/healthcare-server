import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { HttpError } from '../../utils/http-error';

export const passportSuccessController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as UserInterface;
    if (!user) {
      throw new HttpError(403, 'Unauthorized Access');
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
