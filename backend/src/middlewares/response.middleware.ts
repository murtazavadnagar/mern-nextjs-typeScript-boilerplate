import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const responseFormatter = (_req: Request, res: Response, next: NextFunction): void => {
  res.success = <T>(data: T, message = 'Request successful', statusCode = StatusCodes.OK): void => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  next();
};
