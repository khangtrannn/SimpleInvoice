import axios from 'axios';

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function isAuthLoginRequest(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const requestUrl = error.config?.url ?? '';

  return requestUrl.includes('/auth/login');
}
