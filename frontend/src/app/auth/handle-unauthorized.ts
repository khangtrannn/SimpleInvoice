import { clearAuthSession } from '@/features/auth/auth-storage';

const LOGIN_PATH = '/login';

export function handleUnauthorized() {
  clearAuthSession();
  redirectToLogin();
}

function redirectToLogin() {
  if (window.location.pathname === LOGIN_PATH) {
    return;
  }

  window.location.assign(LOGIN_PATH);
}
