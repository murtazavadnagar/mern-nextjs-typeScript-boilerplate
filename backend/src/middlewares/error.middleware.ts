import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isApiError = error instanceof ApiError;
  const statusCode = isApiError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  const message = isApiError ? error.message : 'Internal server error';

  logger.error(
    `[${req.requestId ?? 'n/a'}] ${req.method} ${req.originalUrl} ${message}${error.stack ? ` | ${error.stack}` : ''}`,
  );

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
};
