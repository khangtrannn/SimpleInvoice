import { http, HttpResponse } from 'msw';

import type { AuthUser, LoginRequest, LoginResponse } from '@/api/types';

export const API_BASE_URL = 'http://localhost:4000';

export const TEST_ACCESS_TOKEN = 'test-access-token';

export const reviewerUser: AuthUser = {
  id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
  email: 'reviewer@simpleinvoice.local',
  fullname: 'SimpleInvoice Reviewer',
};

export const reviewerCredentials: LoginRequest = {
  email: 'reviewer@simpleinvoice.local',
  password: 'Password123',
};

export const authHandlers = [
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    if (
      body.email === reviewerCredentials.email &&
      body.password === reviewerCredentials.password
    ) {
      const response: LoginResponse = {
        accessToken: TEST_ACCESS_TOKEN,
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: reviewerUser,
      };

      return HttpResponse.json(response, { status: 200 });
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
