'use client';

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';

interface RetryAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

let refreshInFlight: Promise<string | null> | null = null;

const performRefresh = async (): Promise<string | null> => {
  try {
    const response = await apiClient.post('/auth/refresh', {});
    const token = response.data?.data?.accessToken as string | undefined;

    if (!token) {
      return null;
    }

    useAuthStore.getState().updateAccessToken(token);
    return token;
  } catch {
    useAuthStore.getState().clearSession();
    return null;
  }
};

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosConfig | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshInFlight) {
      refreshInFlight = performRefresh().finally(() => {
        refreshInFlight = null;
      });
    }

    const newToken = await refreshInFlight;

    if (!newToken) {
      return Promise.reject(error);
    }

    const retryConfig: AxiosRequestConfig = {
      ...originalRequest,
      headers: {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      },
    };

    return apiClient.request(retryConfig);
  },
);

export default apiClient;
