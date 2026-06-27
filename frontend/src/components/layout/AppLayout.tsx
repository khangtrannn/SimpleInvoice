import { LogOut, ReceiptText } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router';

import { useAuth } from '@/features/auth/auth-context';

export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const initials = user?.fullname
    ? user.fullname
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-[#F0F4FB]">
      <header className="sticky top-0 z-10 bg-[#0D1F3C] shadow-lg shadow-[#0D1F3C]/25">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/invoices" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/15 ring-1 ring-amber-400/25">
              <ReceiptText className="h-4.5 w-4.5 text-amber-400" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-white">SimpleInvoice</span>
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              className="rounded-lg px-3 py-2 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              to="/invoices"
            >
              Invoices
            </Link>

            <div className="mx-1 h-5 w-px bg-white/15" />

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white ring-2 ring-white/10">
                {initials}
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-xs font-semibold text-slate-200">{user?.fullname}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-transparent px-3 py-2 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
