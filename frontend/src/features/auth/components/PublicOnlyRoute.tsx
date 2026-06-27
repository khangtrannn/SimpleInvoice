import { Navigate, Outlet } from 'react-router';

import { useAuth } from '@/features/auth/auth-context';

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Checking your session...</p>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/invoices" replace />;
  }

  return <Outlet />;
}