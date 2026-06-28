import type { ReactNode } from 'react';

type DetailInfoLineProps = {
  icon: ReactNode;
  value: string | null;
};

export function DetailInfoLine({ icon, value }: DetailInfoLineProps) {
  if (!value?.trim()) {
    return null;
  }

  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-900">{icon}</span>
      <span>{value}</span>
    </div>
  );
}
