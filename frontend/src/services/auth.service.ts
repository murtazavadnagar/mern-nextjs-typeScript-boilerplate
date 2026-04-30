import apiClient from './api/axios-client';
import { ApiResponse } from '@/types/api';
import { AuthResult, LoginPayload } from '@/types/auth';
import { User } from '@/types/user';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/login', payload);
    return response.data.data;
  },

  async refreshToken(): Promise<AuthResult> {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/refresh', {});
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout', {});
  },

  async me(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },
};
