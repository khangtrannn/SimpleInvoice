import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { getCurrentUser } from '@/api/auth.api';
import type { AuthUser } from '@/api/types';
import { AuthContext, type AuthContextValue } from '@/features/auth/auth-context-instance';
import {
  clearAuthSession,
  getAccessToken,
  getStoredAuthUser,
  setAccessToken,
  setStoredAuthUser,
} from '@/features/auth/auth-storage';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    getAccessToken() ? getStoredAuthUser() : null,
  );
  const [isLoading, setIsLoading] = useState(() => Boolean(getAccessToken()));

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    let isMounted = true;

    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        setStoredAuthUser(currentUser);
        setUser(currentUser);
      } catch {
        clearAuthSession();

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: Boolean(user && getAccessToken()),
      isLoading,
      signIn: (loginResponse) => {
        setAccessToken(loginResponse.accessToken);
        setStoredAuthUser(loginResponse.user);
        setUser(loginResponse.user);
      },
      logout: () => {
        clearAuthSession();
        setUser(null);
      },
    };
  }, [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}