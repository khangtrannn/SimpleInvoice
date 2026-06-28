import { createContext } from 'react';

import type { AuthUser, LoginResponse } from '@/api/types';

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (loginResponse: LoginResponse) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
