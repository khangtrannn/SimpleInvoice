import { describe, expect, it } from 'vitest';

import { parseClientEnv } from './env';

describe('parseClientEnv', () => {
  it('returns normalized frontend env when config is valid with absolute URL', () => {
    // Arrange
    const rawEnv = {
      VITE_API_BASE_URL: 'http://localhost:4000',
    };

    // Act
    const env = parseClientEnv(rawEnv);

    // Assert
    expect(env).toEqual({
      API_BASE_URL: 'http://localhost:4000',
    });
  });

  it('allows https API base URL', () => {
    // Arrange
    const rawEnv = {
      VITE_API_BASE_URL: 'https://api.simpleinvoice.com',
    };

    // Act
    const env = parseClientEnv(rawEnv);

    // Assert
    expect(env.API_BASE_URL).toBe('https://api.simpleinvoice.com');
  });

  it('allows root-relative API base URL', () => {
    // Arrange
    const rawEnv = {
      VITE_API_BASE_URL: '/api',
    };

    // Act
    const env = parseClientEnv(rawEnv);

    // Assert
    expect(env.API_BASE_URL).toBe('/api');
  });

  it('throws when API base URL is missing', () => {
    // Arrange
    const rawEnv = {};

    // Act / Assert
    expect(() => parseClientEnv(rawEnv)).toThrow(
      /Invalid frontend environment configuration/,
    );
  });

  it('throws when API base URL is empty', () => {
    // Arrange
    const rawEnv = {
      VITE_API_BASE_URL: '',
    };

    // Act / Assert
    expect(() => parseClientEnv(rawEnv)).toThrow(
      /VITE_API_BASE_URL is required/,
    );
  });

  it('throws when API base URL is not absolute or root-relative', () => {
    // Arrange
    const rawEnv = {
      VITE_API_BASE_URL: 'localhost:4000',
    };

    // Act / Assert
    expect(() => parseClientEnv(rawEnv)).toThrow(
      /must be an absolute http\(s\) URL or a root-relative path/,
    );
  });
});
