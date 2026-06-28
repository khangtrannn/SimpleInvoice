import { http, HttpResponse } from 'msw';

import type { LoginRequest } from '@/api/types';
import { createMockLoginResponse } from '@/test/factories/auth.factory';
import { API_BASE_URL, TEST_ACCESS_TOKEN } from '@/test/mocks/constants';
import { reviewerCredentials, reviewerUser } from '@/test/mocks/auth-fixtures';

export const authHandlers = [
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    if (
      body.email === reviewerCredentials.email &&
      body.password === reviewerCredentials.password
    ) {
      return HttpResponse.json(createMockLoginResponse(), { status: 200 });
    }

    return HttpResponse.json(
      {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
        timestamp: '2026-06-27T10:00:00.000Z',
        path: '/auth/login',
      },
      { status: 401 },
    );
  }),

  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authorization = request.headers.get('Authorization');

    if (authorization !== `Bearer ${TEST_ACCESS_TOKEN}`) {
      return HttpResponse.json(
        {
          statusCode: 401,
          message: 'Missing, invalid, or expired access token',
          error: 'Unauthorized',
          timestamp: '2026-06-27T10:00:00.000Z',
          path: '/auth/me',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json(reviewerUser, { status: 200 });
  }),
];
