import { afterEach, describe, expect, it } from 'vitest';

import {
  clearAuthSession,
  getAccessToken,
  getStoredAuthUser,
  setAccessToken,
  setStoredAuthUser,
} from './auth-storage';

describe('auth-storage', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('stores and reads access token', () => {
    // Arrange
    setAccessToken('access-token');

    // Act
    const token = getAccessToken();

    // Assert
    expect(token).toBe('access-token');
  });

  it('stores and reads auth user', () => {
    // Arrange
    const user = {
      id: 'user-1',
      email: 'khang@example.com',
      fullname: 'Khang Tran',
    };

    setStoredAuthUser(user);

    // Act
    const result = getStoredAuthUser();

    // Assert
    expect(result).toEqual(user);
  });

  it('returns null and clears invalid stored auth user', () => {
    // Arrange
    window.localStorage.setItem(
      'simple_invoice_auth_user',
      JSON.stringify({
        id: 'user-1',
        email: 'invalid-email',
      }),
    );

    // Act
    const result = getStoredAuthUser();

    // Assert
    expect(result).toBeNull();
    expect(window.localStorage.getItem('simple_invoice_auth_user')).toBeNull();
  });

  it('clears full auth session', () => {
    // Arrange
    setAccessToken('access-token');
    setStoredAuthUser({
      id: 'user-1',
      email: 'khang@example.com',
      fullname: 'Khang Tran',
    });

    // Act
    clearAuthSession();

    // Assert
    expect(getAccessToken()).toBeNull();
    expect(getStoredAuthUser()).toBeNull();
  });
});
