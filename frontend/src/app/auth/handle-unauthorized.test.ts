import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getAccessToken,
  getStoredAuthUser,
  setAccessToken,
  setStoredAuthUser,
} from '@/features/auth/auth-storage';

import { handleUnauthorized } from './handle-unauthorized';

const locationAssignMock = vi.fn();

describe('handleUnauthorized', () => {
  beforeEach(() => {
    locationAssignMock.mockClear();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        pathname: '/invoices',
        assign: locationAssignMock,
      },
    });
  });

  it('clears stored auth session', () => {
    // Arrange
    setAccessToken('access-token');
    setStoredAuthUser({
      id: 'user-id',
      fullname: 'Khang Tran',
      email: 'khang@example.com',
    });

    // Act
    handleUnauthorized();

    // Assert
    expect(getAccessToken()).toBeNull();
    expect(getStoredAuthUser()).toBeNull();
  });

  it('redirects to login when current page is not login', () => {
    // Arrange
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        pathname: '/invoices',
        assign: locationAssignMock,
      },
    });

    // Act
    handleUnauthorized();

    // Assert
    expect(locationAssignMock).toHaveBeenCalledWith('/login');
  });

  it('does not redirect again when current page is already login', () => {
    // Arrange
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        pathname: '/login',
        assign: locationAssignMock,
      },
    });

    // Act
    handleUnauthorized();

    // Assert
    expect(locationAssignMock).not.toHaveBeenCalled();
  });
});
