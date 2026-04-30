import { StatusCodes } from 'http-status-codes';
import { CreateUserDto, UpdateUserDto, UserListQueryDto } from '../dto/user.dto';
import { AuditLogRepository } from '../repositories/audit-log.repository';
import { UserRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { hashPassword } from '../utils/password';
import { PaginationMeta } from '../types/user';
import { IUser } from '../models/User';

interface RequestAuditContext {
  actorId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

const mapUser = (user: IUser): Record<string, unknown> => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
    profileImageUrl: user.profileImageUrl,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export class UserService {
  private userRepository: UserRepository;
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.auditLogRepository = new AuditLogRepository();
  }

  async createUser(dto: CreateUserDto, context: RequestAuditContext): Promise<Record<string, unknown>> {
    const existingByUsername = await this.userRepository.findByUsername(dto.username);
    if (existingByUsername) {
      throw new ApiError(StatusCodes.CONFLICT, 'Username already exists');
    }

    const existingByEmail = await this.userRepository.findByEmail(dto.email);
    if (existingByEmail) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists');
    }

    const passwordHash = await hashPassword(dto.password);

    const createdUser = await this.userRepository.create({
      ...dto,
      passwordHash,
      createdBy: context.actorId,
    });

    await this.auditLogRepository.create({
      actorId: context.actorId,
      action: 'CREATE',
      entity: 'User',
      entityId: createdUser.id,
      changes: mapUser(createdUser),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      requestId: context.requestId,
    });

    return mapUser(createdUser);
  }

  async listUsers(query: UserListQueryDto): Promise<{ users: Record<string, unknown>[]; meta: PaginationMeta }> {
    const { users, total } = await this.userRepository.list(query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    return {
      users: users.map((user) => mapUser(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: string): Promise<Record<string, unknown>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    return mapUser(user);
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
    context: RequestAuditContext,
  ): Promise<Record<string, unknown>> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (dto.email && dto.email !== user.email) {
      const existingByEmail = await this.userRepository.findByEmail(dto.email);
      if (existingByEmail && existingByEmail.id !== user.id) {
        throw new ApiError(StatusCodes.CONFLICT, 'Email already exists');
      }
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await hashPassword(dto.password);
    }

    const updatedUser = await this.userRepository.updateById(userId, {
      ...dto,
      passwordHash,
      updatedBy: context.actorId,
    });

    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    await this.auditLogRepository.create({
      actorId: context.actorId,
      action: 'UPDATE',
      entity: 'User',
      entityId: userId,
      changes: dto as unknown as Record<string, unknown>,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      requestId: context.requestId,
    });

    return mapUser(updatedUser);
  }

  async deleteUser(userId: string, context: RequestAuditContext): Promise<void> {
    const deletedUser = await this.userRepository.softDeleteById(userId, context.actorId);

    if (!deletedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    await this.auditLogRepository.create({
      actorId: context.actorId,
      action: 'DELETE',
      entity: 'User',
      entityId: userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      requestId: context.requestId,
    });
  }
}
