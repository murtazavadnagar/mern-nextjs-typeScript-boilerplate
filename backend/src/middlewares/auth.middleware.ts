import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../utils/token';
import { ApiError } from '../utils/ApiError';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authorization token missing'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    if (payload.type !== 'access') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token type');
    }

    const user = await userRepository.findById(payload.sub);

    if (!user || user.isDeleted || !user.isActive) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'User is unauthorized');
    }

    req.authUser = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired access token'));
  }
};
