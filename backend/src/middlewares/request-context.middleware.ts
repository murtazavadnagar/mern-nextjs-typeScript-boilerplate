import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  req.requestId = randomUUID();
  res.setHeader('x-request-id', req.requestId);
  next();
};
