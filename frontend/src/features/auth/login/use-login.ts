import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { login } from '@/api/auth.api';
import type { LoginRequest } from '@/api/types';
import { AUTH_ROUTES } from '@/features/auth/auth-route.constants';
import { useAuth } from '@/features/auth/use-auth';

export function useLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      signIn(data);
      navigate(AUTH_ROUTES.authenticatedHome, { replace: true });
    },
  });
}
