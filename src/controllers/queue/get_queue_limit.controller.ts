import { RequestHandler } from 'express';

import { getQueueLimitService } from '../../services/queue/get_queue_limit.service';

export const getQueueLimitController: RequestHandler = async (_req, res) => {
  try {
    const queueLimit = await getQueueLimitService();
    res.status(200).json({
      success: true,
      data: queueLimit,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
