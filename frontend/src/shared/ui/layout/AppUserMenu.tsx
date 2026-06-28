import type { AuthUser } from '@/api/types';

import { getUserInitials } from './get-user-initials';

type AppUserMenuProps = {
  user: AuthUser | null;
  onLogout: () => void;
};

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function AppUserMenu({ user, onLogout }: AppUserMenuProps) {
  const initials = getUserInitials(user?.fullname);

  return (
    <nav className="flex shrink-0 items-center gap-2 text-sm" aria-label="Account">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 ring-2 ring-slate-200">
          {initials}
        </div>
        <div className="hidden text-left lg:block">
          <p className="text-sm font-semibold text-slate-800">{user?.fullname}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      {/* Icon-only on mobile, text + icon on sm+ */}
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-transparent px-2 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3"
      >
        <LogoutIcon />
        <span className="hidden sm:inline">Log out</span>
      </button>
    </nav>
  );
}
