/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../utils/http-error';
import log from '../../utils/logger';

export const ErrorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });

  log.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);
};
