import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../types/user';
import { ApiError } from '../utils/ApiError';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // console.log("authorize", req.authUser)
    if (!req.authUser) {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required'));
      return;
    }

    if (!roles.includes(req.authUser.role)) {
      next(new ApiError(StatusCodes.FORBIDDEN, 'Forbidden access'));
      return;
    }

    next();
  };
};
