import apiClient from './api/axios-client';
import { ApiResponse } from '@/types/api';
import { CreateUserPayload, UpdateUserPayload, User, UsersQueryParams } from '@/types/user';

const toQueryString = (params: UsersQueryParams): string => {
  const searchParams = new URLSearchParams();

  searchParams.set('page', String(params.page));
  searchParams.set('limit', String(params.limit));

  if (params.search) {
    searchParams.set('search', params.search);
  }
  if (params.role) {
    searchParams.set('role', params.role);
  }
  if (typeof params.isActive === 'boolean') {
    searchParams.set('isActive', String(params.isActive));
  }
  if (params.sortBy) {
    searchParams.set('sortBy', params.sortBy);
  }
  if (params.sortOrder) {
    searchParams.set('sortOrder', params.sortOrder);
  }

  return searchParams.toString();
};

export const usersService = {
  async list(
    params: UsersQueryParams,
  ): Promise<{ users: User[]; meta: ApiResponse<User[]>['meta'] }> {
    const response = await apiClient.get<ApiResponse<User[]>>(`/users?${toQueryString(params)}`);

    return {
      users: response.data.data,
      meta: response.data.meta,
    };
  },

  async getById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>('/users', payload);
    return response.data.data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, payload);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
