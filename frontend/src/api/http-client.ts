import axios from 'axios';

import { handleUnauthorized } from '@/app/auth/handle-unauthorized';
import { isAuthLoginRequest, isUnauthorizedError } from '@/api/http-error';
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
    if (isUnauthorizedError(error) && !isAuthLoginRequest(error)) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  },
);