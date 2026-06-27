import { Link, Outlet, useNavigate } from 'react-router';

import { useAuth } from '@/features/auth/auth-context';

export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/invoices" className="text-lg font-semibold text-slate-950">
            SimpleInvoice
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link className="font-medium text-slate-700 hover:text-slate-950" to="/invoices">
              Invoices
            </Link>

            <Link
              className="hidden rounded-lg bg-slate-950 px-3 py-2 font-medium text-white hover:bg-slate-800 sm:inline-flex"
              to="/invoices/new"
            >
              Create invoice
            </Link>

            <div className="hidden h-6 w-px bg-slate-200 sm:block" />

            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-950">{user?.fullname}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}