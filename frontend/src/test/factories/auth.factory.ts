import type { AuthUser, LoginRequest, LoginResponse } from '@/api/types';

import { TEST_ACCESS_TOKEN } from '@/test/mocks/constants';

export function createMockAuthUser(
  overrides: Partial<AuthUser> = {},
): AuthUser {
  return {
    id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    email: 'reviewer@simpleinvoice.local',
    fullname: 'SimpleInvoice Reviewer',
    ...overrides,
  };
}

export function createMockLoginRequest(
  overrides: Partial<LoginRequest> = {},
): LoginRequest {
  return {
    email: 'reviewer@simpleinvoice.local',
    password: 'Password123',
    ...overrides,
  };
}

export function createMockLoginResponse(
  overrides: Partial<LoginResponse> = {},
): LoginResponse {
  return {
    accessToken: TEST_ACCESS_TOKEN,
    tokenType: 'Bearer',
    expiresIn: 3600,
    user: createMockAuthUser(),
    ...overrides,
  };
}
