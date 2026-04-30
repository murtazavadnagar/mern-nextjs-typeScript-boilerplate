import { UserRole } from '../types/user';

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
}

export interface UpdateUserDto {
  email?: string;
  role?: UserRole;
  fullName?: string;
  password?: string;
  isActive?: boolean;
}

export interface UserListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'username' | 'email' | 'fullName';
  sortOrder?: 'asc' | 'desc';
}
