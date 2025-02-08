import { NextFunction, Request, Response } from 'express';

import { getQueueLimitHelper } from '../../helper/get_queue_limit.helper';
import { UserInterface } from '../../models/user.model';
import { createQueueService } from '../../services/queue/create_queue.service';
import { HttpError } from '../../utils/http-error';

export const createQueueController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user as UserInterface;
    const purpose = req.body.purpose;
    const userId = _id;

    const queueLimitStatus = await getQueueLimitHelper();

    if (queueLimitStatus.status === 'OFF') {
      throw new HttpError(
        400,
        'The operation is not allowed right now. Please try again later.'
      );
    }

    const response = await createQueueService(userId, purpose);

    res.json({ message: response });
  } catch (error) {
    next(error);
  }
};
