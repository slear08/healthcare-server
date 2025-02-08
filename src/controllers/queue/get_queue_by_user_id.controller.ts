import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { getQueueByUserService } from '../../services/queue/get_queue_by_user_id.service';

export async function getQueueByUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.user as UserInterface;
    const queues = await getQueueByUserService(_id);

    res.json({ message: 'Queue list fetched', data: queues });
  } catch (error) {
    next(error);
  }
}
