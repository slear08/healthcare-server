import { NextFunction, Request, Response } from 'express';

import { getUserListService } from '../../services/user/get_user_list.service';

export async function getUserListController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getUserListService();
    res.json({ message: 'User list fetched', data: users });
  } catch (error) {
    next(error);
  }
}
