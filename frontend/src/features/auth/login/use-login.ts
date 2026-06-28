import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { login } from '@/api/auth.api';
import type { LoginRequest } from '@/api/types';
import { useAuth } from '@/features/auth/auth-context';

export function useLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      signIn(data);
      navigate('/invoices', { replace: true });
    },
  });
}
