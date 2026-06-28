import type { ReactNode } from 'react';

type DetailCardProps = {
  title?: string;
  children: ReactNode;
};

export function DetailCard({ title, children }: DetailCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {title ? (
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      ) : null}

      {children}
    </section>
  );
}
