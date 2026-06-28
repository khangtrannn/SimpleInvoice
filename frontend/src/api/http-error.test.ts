import type { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { isAuthLoginRequest, isUnauthorizedError } from './http-error';

describe('isUnauthorizedError', () => {
  it('returns true for axios 401 errors', () => {
    // Arrange
    const error = createAxiosError({
      status: 401,
      url: '/invoices',
    });

    // Act
    const result = isUnauthorizedError(error);

    // Assert
    expect(result).toBe(true);
  });

  it('returns false for non-401 axios errors', () => {
    // Arrange
    const error = createAxiosError({
      status: 500,
      url: '/invoices',
    });

    // Act
    const result = isUnauthorizedError(error);

    // Assert
    expect(result).toBe(false);
  });

  it('returns false for non-axios errors', () => {
    // Arrange
    const error = new Error('Something went wrong');

    // Act
    const result = isUnauthorizedError(error);

    // Assert
    expect(result).toBe(false);
  });
});

describe('isAuthLoginRequest', () => {
  it('returns true for auth login request errors', () => {
    // Arrange
    const error = createAxiosError({
      status: 401,
      url: '/auth/login',
    });

    // Act
    const result = isAuthLoginRequest(error);

    // Assert
    expect(result).toBe(true);
  });

  it('returns false for non-login request errors', () => {
    // Arrange
    const error = createAxiosError({
      status: 401,
      url: '/invoices',
    });

    // Act
    const result = isAuthLoginRequest(error);

    // Assert
    expect(result).toBe(false);
  });
});

function createAxiosError({
  status,
  url,
}: {
  status: number;
  url: string;
}): AxiosError {
  return {
    isAxiosError: true,
    name: 'AxiosError',
    message: 'Request failed',
    config: {
      url,
      headers: {},
    },
    response: {
      status,
      statusText: String(status),
      headers: {},
      config: {
        url,
        headers: {},
      },
      data: {},
    },
    toJSON: () => ({}),
  } as AxiosError;
}
