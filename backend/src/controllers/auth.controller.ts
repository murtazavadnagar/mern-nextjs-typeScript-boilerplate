import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/auth.service';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { UserService } from '../services/user.service';

const authService = new AuthService();
const userService = new UserService();

const getRefreshTokenFromRequest = (req: Request): string | undefined => {
  const fromCookie = req.cookies?.[env.JWT_REFRESH_COOKIE_NAME] as string | undefined;
  if (fromCookie) {
    return fromCookie;
  }

  const fromBody = req.body.refreshToken as string | undefined;
  return fromBody;
};

const setRefreshCookie = (res: Response, refreshToken: string): void => {
  res.cookie(env.JWT_REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(env.JWT_REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body, req.ip);
  setRefreshCookie(res, result.refreshToken);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        fullName: result.user.fullName,
        role: result.user.role,
      },
    },
  });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = getRefreshTokenFromRequest(req);

  if (!refreshToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Refresh token is required');
  }

  const result = await authService.refresh(refreshToken, req.ip);
  setRefreshCookie(res, result.refreshToken);

  res.success(
    {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        fullName: result.user.fullName,
        role: result.user.role,
      },
    },
    'Token refreshed',
  );
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = getRefreshTokenFromRequest(req);

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  clearRefreshCookie(res);
  res.success(null, 'Logout successful');
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.authUser) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const user = await userService.getUserById(req.authUser.id);
  res.success(user);
};
