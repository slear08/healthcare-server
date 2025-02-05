import { NextFunction, Request, Response } from 'express';

import { getQueueListService } from '../../services/queue/get_queue_list.service';

export const getQueueListController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getQueueListService();

    res.json({ queueList: response });
  } catch (error) {
    next(error);
  }
};
