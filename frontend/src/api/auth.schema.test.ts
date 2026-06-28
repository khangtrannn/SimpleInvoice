import { describe, expect, it } from 'vitest';

import { ApiResponseValidationError } from '@/api/parse-api-response';

import { parseCurrentUserResponse, parseLoginResponse } from './auth.schema';

describe('parseLoginResponse', () => {
  it('parses a valid login response', () => {
    // Arrange
    const response = {
      accessToken: 'valid-access-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 'user-1',
        email: 'khang@example.com',
        fullname: 'Khang Tran',
      },
    };

    // Act
    const result = parseLoginResponse(response);

    // Assert
    expect(result).toEqual(response);
  });

  it('rejects missing access token', () => {
    // Arrange
    const response = {
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 'user-1',
        email: 'khang@example.com',
        fullname: 'Khang Tran',
      },
    };

    // Act + Assert
    expect(() => parseLoginResponse(response)).toThrow(
      ApiResponseValidationError,
    );
  });

  it('rejects invalid user email', () => {
    // Arrange
    const response = {
      accessToken: 'valid-access-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: 'user-1',
        email: 'invalid-email',
        fullname: 'Khang Tran',
      },
    };

    // Act + Assert
    expect(() => parseLoginResponse(response)).toThrow(
      ApiResponseValidationError,
    );
  });
});

describe('parseCurrentUserResponse', () => {
  it('parses a valid current user response', () => {
    // Arrange
    const response = {
      id: 'user-1',
      email: 'khang@example.com',
      fullname: 'Khang Tran',
    };

    // Act
    const result = parseCurrentUserResponse(response);

    // Assert
    expect(result).toEqual(response);
  });

  it('rejects invalid current user response', () => {
    // Arrange
    const response = {
      id: 'user-1',
      email: 'khang@example.com',
    };

    // Act + Assert
    expect(() => parseCurrentUserResponse(response)).toThrow(
      ApiResponseValidationError,
    );
  });
});
