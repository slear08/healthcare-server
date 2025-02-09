import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { getActiveQueueByUserIdService } from '../../services/queue/get_active_queue_by_user_id.service';

export async function getActiveQueueByUserIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { _id } = req.user as UserInterface;
    const queues = await getActiveQueueByUserIdService(_id);

    res.json({ message: 'Queue list fetched', data: queues });
  } catch (error) {
    next(error);
  }
}
