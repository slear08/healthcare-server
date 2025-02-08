import { NextFunction, Request, Response } from 'express';

import { updateUserQueueStatusService } from '../../services/queue/update_user_queue_status.service';
import { HttpError } from '../../utils/http-error';

export async function updateUserQueueStatusController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, queueId } = req.params;
    const { status } = req.body;

    if (!['waiting', 'in-progress', 'completed'].includes(status)) {
      throw new HttpError(400, 'Invalid status value');
    }

    const updatedQueue = await updateUserQueueStatusService(
      userId,
      queueId,
      status
    );

    res.json({ message: 'Queue status updated', data: updatedQueue });
  } catch (error) {
    next(error);
  }
}
