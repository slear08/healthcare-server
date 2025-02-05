import { NextFunction, Request, Response } from 'express';

import { UserInterface } from '../../models/user.model';
import { createQueueService } from '../../services/queue/create_queue.service';

export const createQueueController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user as UserInterface;
    const userId = _id;
    const response = await createQueueService(userId);

    res.json({ message: response });
  } catch (error) {
    next(error);
  }
};
