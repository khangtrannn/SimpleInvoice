import { z } from 'zod';

import { parseApiResponse } from '@/api/parse-api-response';
import type { AuthUser, LoginResponse } from '@/api/types';

export const authUserSchema: z.ZodType<AuthUser> = z.object({
  id: z.string(),
  email: z.string().email(),
  fullname: z.string(),
});

export const loginResponseSchema: z.ZodType<LoginResponse> = z.object({
  accessToken: z.string().min(1),
  tokenType: z.string(),
  expiresIn: z.number(),
  user: authUserSchema,
});

export function parseLoginResponse(data: unknown): LoginResponse {
  return parseApiResponse(loginResponseSchema, data, 'POST /auth/login');
}

export function parseCurrentUserResponse(data: unknown): AuthUser {
  return parseApiResponse(authUserSchema, data, 'GET /auth/me');
}
