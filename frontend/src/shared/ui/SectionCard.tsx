import type { ReactNode } from 'react';

type SectionCardProps = {
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({ icon, title, children, className = '' }: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      {title ? (
        <div className="mb-5 flex items-center gap-3">
          {icon ? (
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
              {icon}
            </span>
          ) : null}

          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        </div>
      ) : null}

      {children}
    </section>
  );
}
