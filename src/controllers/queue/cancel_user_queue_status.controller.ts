import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { cancelUserQueueStatusService } from '../../services/queue/cancel_user_queue_status.service';

export async function cancelUserQueueStatusController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { queueId } = req.params;
    const { _id } = req.user as UserInterface;
    const userId = _id;

    const updatedQueue = await cancelUserQueueStatusService(userId, queueId);

    res.json({ message: 'Queue status updated', data: updatedQueue });
  } catch (error) {
    next(error);
  }
}
