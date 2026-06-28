import { Navigate, Outlet, useLocation } from 'react-router';

import { AUTH_ROUTES } from '@/features/auth/auth-route.constants';
import { useAuth } from '@/features/auth/use-auth';

import { AuthRouteLoading } from './AuthRouteLoading';

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthRouteLoading />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={AUTH_ROUTES.login}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}