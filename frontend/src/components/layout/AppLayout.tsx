import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

import { useAuth } from '@/features/auth/auth-context';

import { AppHeader } from './AppHeader';

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

  return (
    <div className="min-h-screen bg-[#F0F4FB]">
      <AppHeader user={user} scrolled={scrolled} onLogout={handleLogout} />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
