import { NextFunction, Request, Response } from 'express';

import { getQueueLimitHelper } from '../../helper/get_queue_limit.helper';
import { getQueueListService } from '../../services/queue/get_queue_list.service';
import { HttpError } from '../../utils/http-error';

export const getQueueListController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, sort, page, limit, search, purpose } = req.query;

    const params = {
      status: typeof status === 'string' ? status : undefined,
      sort: typeof sort === 'string' ? sort : undefined,
      search: typeof search === 'string' ? search : undefined,
      page: page ? Math.max(1, parseInt(page as string)) : 1,
      purpose: typeof purpose === 'string' ? purpose : undefined,
      limit: limit ? Math.min(100, Math.max(1, parseInt(limit as string))) : 10,
    };

    if (
      params.status &&
      !['waiting', 'in-progress', 'completed', 'cancelled'].includes(
        params.status
      )
    ) {
      throw new HttpError(
        400,
        'Invalid status parameter. Must be one of: waiting, in-progress, completed'
      );
    }

    if (params.sort) {
      const [field, order] = params.sort.split(':');
      if (
        !['createdAt', 'userId', 'status'].includes(field) ||
        !['asc', 'desc'].includes(order)
      ) {
        throw new HttpError(
          400,
          'Invalid sort parameter. Format should be field:order, e.g., createdAt:desc'
        );
      }
    }

    if (isNaN(params.page) || isNaN(params.limit)) {
      throw new HttpError(
        400,
        'Invalid pagination parameters. Page and limit must be valid numbers'
      );
    }

    const { queueList, pagination } = await getQueueListService(params);
    const queueLimitStatus = await getQueueLimitHelper();

    res.json({
      queueLimitStatus,
      queueList,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};
