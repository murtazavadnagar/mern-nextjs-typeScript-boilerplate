import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services/user.service';
import { UserListQueryDto } from '../dto/user.dto';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../types/user';

const userService = new UserService();

const getAuditContext = (req: Request) => ({
  actorId: req.authUser?.id,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  requestId: req.requestId,
});

export const createUser = async (req: Request, res: Response): Promise<void> => {
  // console.log('Create user: ', req.authUser);
  // console.log('Create user: ', req.body);
  if (req.authUser?.role === UserRole.USER && req.body.role === UserRole.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden access');
  }
  const user = await userService.createUser(req.body, getAuditContext(req));
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const query = req.query as unknown as UserListQueryDto;
  const result = await userService.listUsers(query);

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Users fetched successfully',
    data: result.users,
    meta: result.meta,
  });
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getUserById(req.params.id);
  if (req.authUser?.role !== UserRole.ADMIN && user.role === UserRole.ADMIN) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden access');
  }
  res.success(user);
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.updateUser(req.params.id, req.body, getAuditContext(req));
  res.success(user, 'User updated successfully');
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  await userService.deleteUser(req.params.id, getAuditContext(req));
  res.success(null, 'User deleted successfully');
};
