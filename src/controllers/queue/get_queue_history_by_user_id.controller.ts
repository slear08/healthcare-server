import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { getQueueHistoryByUserService } from '../../services/queue/get_queue_history_by_user_id.service';

export async function getQueueHistoryByUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.user as UserInterface;
    const queues = await getQueueHistoryByUserService(_id);

    res.json({ message: 'User queue history', data: queues });
  } catch (error) {
    next(error);
  }
}
