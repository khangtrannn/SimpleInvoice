import type { AuthUser } from '@/api/types';

import { AppLogo } from './AppLogo';
import { AppUserMenu } from './AppUserMenu';

type AppHeaderProps = {
  user: AuthUser | null;
  scrolled: boolean;
  onLogout: () => void;
};

export function AppHeader({ user, scrolled, onLogout }: AppHeaderProps) {
  return (
    <header
      className={[
        'app-shell-header sticky top-0 z-10 transition-all duration-300',
        scrolled
          ? 'bg-white/70 backdrop-blur-3xl shadow-md border-b border-black/[0.08]'
          : 'bg-white border-b border-black/[0.06]',
      ].join(' ')}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <AppLogo />

        <AppUserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}
