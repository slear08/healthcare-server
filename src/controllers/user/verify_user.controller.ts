import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { verifyUserService } from '../../services/user/verify_user.service';

export const verifyUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, mobileNumber } = req.body;
    const { _id } = req.user as UserInterface;

    const userId = _id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await verifyUserService({
      userId: userId.toString(),
      name,
      mobileNumber,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
