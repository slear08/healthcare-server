import { NextFunction, Response } from 'express';

import { AuthRequest } from '../../middlewares/auth/auth.middleware';
import { changePasswordService } from '../../services/auth/change_password.service';

export const changePasswordController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.admin?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await changePasswordService({
      userId: userId.toString(),
      currentPassword,
      newPassword,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
