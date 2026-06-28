import type { ReactNode } from 'react';

type CreateInvoiceSectionCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export function CreateInvoiceSectionCard({
  icon,
  title,
  children,
}: CreateInvoiceSectionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
          {icon}
        </span>

        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>

      {children}
    </section>
  );
}
