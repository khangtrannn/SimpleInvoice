import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { getCurrentUser } from '@/api/auth.api';
import type { AuthUser, LoginResponse } from '@/api/types';
import {
  clearAuthSession,
  getAccessToken,
  getStoredAuthUser,
  setAccessToken,
  setStoredAuthUser,
} from '@/features/auth/auth-storage';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (loginResponse: LoginResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}