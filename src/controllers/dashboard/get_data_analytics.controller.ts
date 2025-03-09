import { NextFunction, Request, Response } from 'express';

import { getDataAnalyticsService } from '../../services/dashboard/get_data_analytics.service';

export async function getDataAnalyticsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await getDataAnalyticsService();
    res.json({ message: 'Total users fetched', data: result });
  } catch (error) {
    next(error);
  }
}
