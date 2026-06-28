import { httpClient } from '@/api/http-client';
import {
  parseCurrentUserResponse,
  parseLoginResponse,
} from '@/api/auth.schema';
import type { AuthUser, LoginRequest, LoginResponse } from '@/api/types';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await httpClient.post('/auth/login', payload);

  return parseLoginResponse(response.data);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await httpClient.get('/auth/me');

  return parseCurrentUserResponse(response.data);
}