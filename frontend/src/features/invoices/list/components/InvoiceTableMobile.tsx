import { Link } from 'react-router';

import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge';

import type { InvoiceTableRowViewModel } from './invoice-table.mapper';

type InvoiceTableMobileProps = {
  rows: InvoiceTableRowViewModel[];
};

export function InvoiceTableMobile({ rows }: InvoiceTableMobileProps) {
  return (
    <div className="flex flex-col gap-3 p-4 lg:hidden">
      {rows.map((row) => (
        <Link
          key={row.id}
          to={row.detailPath}
          className="block bg-white rounded-xl border border-slate-200 p-4 shadow-sm transition hover:shadow-md hover:border-slate-300 active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${row.customerAvatarClassName}`}
              >
                {row.customerInitials}
              </div>

              <div className="min-w-0">
                <p className="font-mono text-xs font-bold text-slate-950 truncate">
                  {row.invoiceNumber}
                </p>

                <p className="text-xs text-slate-500 truncate">
                  {row.customerName}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <InvoiceStatusBadge status={row.status} />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 font-medium">Issued</p>
                <p className="text-slate-900 font-medium">{row.invoiceDate}</p>
              </div>

              <div className="text-right">
                <p className="text-slate-400 font-medium">Due</p>
                {row.dueDate ? (
                  <div>
                    <p className="text-slate-900 font-medium">{row.dueDate}</p>
                    {row.dueDateMeta ? (
                      <p className={`text-xs font-medium ${row.dueDateMeta.colorClassName}`}>
                        {row.dueDateMeta.text}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-slate-400">–</p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-2 flex justify-between items-center">
              <p className="text-slate-400 font-medium">Total</p>
              <p className="font-mono font-bold tabular-nums text-slate-950">
                {row.totalAmount}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
