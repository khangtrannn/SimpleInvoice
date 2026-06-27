import { httpClient } from '@/api/http-client';
import type { AuthUser, LoginRequest, LoginResponse } from '@/api/types';

export async function login(payload: LoginRequest) {
  const response = await httpClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
}

export async function getCurrentUser() {
  const response = await httpClient.get<AuthUser>('/auth/me');
  return response.data;
}