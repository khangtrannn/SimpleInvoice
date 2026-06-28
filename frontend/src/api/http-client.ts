import axios from 'axios';

import { handleUnauthorized } from '@/app/auth/handle-unauthorized';
import { getAccessToken } from '@/features/auth/auth-storage';
import { env } from '@/shared/config/env';

export const httpClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? '';
      const isLoginRequest = requestUrl.includes('/auth/login');

      if (!isLoginRequest) {
        handleUnauthorized();
      }
    }

    return Promise.reject(error);
  },
);