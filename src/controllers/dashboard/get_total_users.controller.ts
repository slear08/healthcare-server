import { NextFunction, Request, Response } from 'express';

import { getTotalUsersService } from '../../services/dashboard/get_total_users.service';

export async function getTotalUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getTotalUsersService();
    res.json({ message: 'Total users fetched', data: result });
  } catch (error) {
    next(error);
  }
}
