import { AUTH_ROUTES } from '@/features/auth/auth-route.constants';
import { clearAuthSession } from '@/features/auth/auth-storage';

export function handleUnauthorized() {
  clearAuthSession();

  if (window.location.pathname !== AUTH_ROUTES.login) {
    window.location.assign(AUTH_ROUTES.login);
  }
}
