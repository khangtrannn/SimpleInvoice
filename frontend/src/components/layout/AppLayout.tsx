import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';

import { useAuth } from '@/features/auth/auth-context';

export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      <header
        className={[
          'app-shell-header sticky top-0 z-10 transition-all duration-300',
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-black/[0.06]'
            : 'bg-white border-b border-black/[0.06]',
        ].join(' ')}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/invoices" className="flex shrink-0 items-center" aria-label="SimpleInvoice home">
            <img
              src="/brand/simple-invoice-logo.png"
              alt="SimpleInvoice"
              className="h-10 w-auto"
            />
          </Link>

          <nav className="flex shrink-0 items-center gap-2 text-sm" aria-label="Account">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 ring-2 ring-slate-200">
                {initials}
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-xs font-semibold text-slate-800">{user?.fullname}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-transparent px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Log out
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
