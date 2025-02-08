import { NextFunction, Request, Response } from 'express';

import { updateQueueLimitService } from '../../services/queue/update_queue_limit.service';
import { HttpError } from '../../utils/http-error';

export async function updateQueueLimitController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { status, limit } = req.body;

    if (!['ON', 'OFF'].includes(status) || typeof limit !== 'number') {
      throw new HttpError(400, 'Invalid request parameters');
    }

    const updatedLimit = await updateQueueLimitService(status, limit);

    res.json({ message: 'Queue limit updated', data: updatedLimit });
  } catch (error) {
    next(error);
  }
}
