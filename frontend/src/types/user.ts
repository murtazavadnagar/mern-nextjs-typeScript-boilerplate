export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserPayload {
  email?: string;
  fullName?: string;
  role?: UserRole;
  password?: string;
  isActive?: boolean;
}

export interface UsersQueryParams {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'username' | 'email' | 'fullName';
  sortOrder?: 'asc' | 'desc';
}
