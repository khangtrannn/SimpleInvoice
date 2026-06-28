import type { AuthUser } from '@/api/types';

import { getUserInitials } from './get-user-initials';

type AppUserMenuProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

export function AppUserMenu({ user, onLogout }: AppUserMenuProps) {
  const initials = getUserInitials(user?.fullname);

  return (
    <nav className="flex shrink-0 items-center gap-2 text-sm" aria-label="Account">
      <div className="hidden items-center gap-3 sm:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 ring-2 ring-slate-200">
          {initials}
        </div>
        <div className="hidden text-left lg:block">
          <p className="text-sm font-semibold text-slate-800">{user?.fullname}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-transparent px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        Log out
      </button>
    </nav>
  );
}
