import { FilterQuery, SortOrder, Types } from 'mongoose';
import { IUser, UserModel } from '../models/User';
import { CreateUserDto, UpdateUserDto, UserListQueryDto } from '../dto/user.dto';

export interface UserListRepositoryResult {
  users: IUser[];
  total: number;
}

export class UserRepository {
  async create(data: CreateUserDto & { passwordHash: string; createdBy?: string }): Promise<IUser> {
    const user = await UserModel.create({
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      role: data.role,
      createdBy: data.createdBy ? new Types.ObjectId(data.createdBy) : null,
      updatedBy: data.createdBy ? new Types.ObjectId(data.createdBy) : null,
    });

    return user;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username: username.toLowerCase(), isDeleted: false });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase(), isDeleted: false });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findOne({ _id: id, isDeleted: false });
  }

  async list(query: UserListQueryDto): Promise<UserListRepositoryResult> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: FilterQuery<IUser> = { isDeleted: false };

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (typeof isActive === 'boolean') {
      filter.isActive = isActive;
    }

    const skip = (page - 1) * limit;
    const sortDirection: SortOrder = sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-passwordHash'),
      UserModel.countDocuments(filter),
    ]);

    return { users, total };
  }

  async updateById(id: string, payload: UpdateUserDto & { passwordHash?: string; updatedBy?: string }): Promise<IUser | null> {
    const updatePayload: Record<string, unknown> = {
      ...payload,
      updatedBy: payload.updatedBy ? new Types.ObjectId(payload.updatedBy) : undefined,
    };

    if (payload.passwordHash) {
      updatePayload.passwordHash = payload.passwordHash;
    }

    delete updatePayload.password;

    return UserModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updatePayload,
      { new: true },
    ).select('-passwordHash');
  }

  async softDeleteById(id: string, actorId?: string): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date(),
        isActive: false,
        updatedBy: actorId ? new Types.ObjectId(actorId) : undefined,
      },
      { new: true },
    ).select('-passwordHash');
  }

  async markLogin(userId: string): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { lastLoginAt: new Date() });
  }
}
