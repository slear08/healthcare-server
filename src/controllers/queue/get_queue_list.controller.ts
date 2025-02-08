import { NextFunction, Request, Response } from 'express';

import { getQueueLimitHelper } from '../../helper/get_queue_limit.helper';
import { getQueueListService } from '../../services/queue/get_queue_list.service';

export const getQueueListController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await getQueueListService();
    const queueLimitStatus = await getQueueLimitHelper();

    res.json({ queueLimitStatus, queueList: response });
  } catch (error) {
    next(error);
  }
};
