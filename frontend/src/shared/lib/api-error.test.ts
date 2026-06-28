import type { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { ApiResponseValidationError } from '@/api/parse-api-response';

import { getApiErrorMessage } from './api-error';

describe('getApiErrorMessage', () => {
  it('returns a dedicated message for API response validation errors', () => {
    // Arrange
    const error = new ApiResponseValidationError('/invoices', []);

    // Act
    const result = getApiErrorMessage(error, 'Failed to load invoices.');

    // Assert
    expect(result).toMatch(/unexpected response from the server/i);
  });

  it('returns the server message for axios errors with a string message', () => {
    // Arrange
    const error = createAxiosError({ message: 'Invoice number already exists.' });

    // Act
    const result = getApiErrorMessage(error);

    // Assert
    expect(result).toBe('Invoice number already exists.');
  });

  it('joins server messages when the message is an array', () => {
    // Arrange
    const error = createAxiosError({ message: ['Field A is required.', 'Field B is invalid.'] });

    // Act
    const result = getApiErrorMessage(error);

    // Assert
    expect(result).toBe('Field A is required.\nField B is invalid.');
  });

  it('returns the fallback message for non-axios errors', () => {
    // Arrange
    const error = new Error('boom');

    // Act
    const result = getApiErrorMessage(error, 'Failed to create invoice.');

    // Assert
    expect(result).toBe('Failed to create invoice.');
  });

  it('returns the fallback message when the axios error has no usable message', () => {
    // Arrange
    const error = createAxiosError({ message: undefined });

    // Act
    const result = getApiErrorMessage(error, 'Failed to create invoice.');

    // Assert
    expect(result).toBe('Failed to create invoice.');
  });

  it('returns a network message when the axios error has no response', () => {
    // Arrange
    const error = createAxiosError({
      message: undefined,
      hasResponse: false,
    });

    // Act
    const result = getApiErrorMessage(error, 'Invalid email or password.');

    // Assert
    expect(result).toMatch(/unable to reach the server/i);
  });

  it('returns a server message for internal server errors', () => {
    // Arrange
    const error = createAxiosError({
      message: 'Internal server error',
      status: 500,
    });

    // Act
    const result = getApiErrorMessage(error, 'Invalid email or password.');

    // Assert
    expect(result).toBe('Internal server error');
  });
});

function createAxiosError({
  message,
  status = 400,
  hasResponse = true,
}: {
  message: string | string[] | undefined;
  status?: number;
  hasResponse?: boolean;
}): AxiosError {
  return {
    isAxiosError: true,
    name: 'AxiosError',
    message: 'Request failed',
    config: {
      url: '/invoices',
      headers: {},
    },
    response: hasResponse
      ? {
          status,
          statusText: String(status),
          headers: {},
          config: {
            url: '/invoices',
            headers: {},
          },
          data: { message },
        }
      : undefined,
    toJSON: () => ({}),
  } as AxiosError;
}
