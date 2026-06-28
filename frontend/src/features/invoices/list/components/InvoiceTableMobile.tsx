import { Link } from 'react-router';

import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge';

import type { InvoiceTableRowViewModel } from './invoice-table.mapper';

type InvoiceTableMobileProps = {
  rows: InvoiceTableRowViewModel[];
};

export function InvoiceTableMobile({ rows }: InvoiceTableMobileProps) {
  return (
    <div className="divide-y divide-slate-100 lg:hidden">
      {rows.map((row) => (
        <Link
          key={row.id}
          to={row.detailPath}
          className="block bg-white p-5 transition hover:bg-slate-50/60"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${row.customerAvatarClassName}`}
              >
                {row.customerInitials}
              </div>

              <div>
                <p className="font-mono text-sm font-bold text-slate-950">
                  {row.invoiceNumber}
                </p>

                <p className="mt-0.5 text-sm text-slate-600">
                  {row.customerName}
                </p>
              </div>
            </div>

            <InvoiceStatusBadge status={row.status} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs tracking-wide text-slate-400 uppercase">
                Issue Date
              </p>

              <p className="mt-1 font-medium text-slate-700">
                {row.invoiceDate}
              </p>
            </div>

            <div>
              <p className="text-xs tracking-wide text-slate-400 uppercase">
                Due Date
              </p>

              {row.dueDate ? (
                <>
                  <p className="mt-1 font-medium text-slate-700">
                    {row.dueDate}
                  </p>

                  {row.dueDateMeta ? (
                    <p className={`text-xs ${row.dueDateMeta.colorClassName}`}>
                      {row.dueDateMeta.text}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 text-slate-400">–</p>
              )}
            </div>

            <div className="col-span-2">
              <p className="text-xs tracking-wide text-slate-400 uppercase">
                Total
              </p>

              <p className="mt-1 font-mono font-bold tabular-nums text-slate-950">
                {row.totalAmount}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
