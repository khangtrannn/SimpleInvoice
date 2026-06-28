import { FileText } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { Link } from 'react-router';

import type { InvoiceListQuery } from '@/api/types';
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge';

import type { InvoiceTableRowViewModel } from './invoice-table.mapper';
import { SortableInvoiceTableHeader } from './SortableInvoiceTableHeader';

type InvoiceTableDesktopProps = {
  rows: InvoiceTableRowViewModel[];
  query?: InvoiceListQuery;
  onSortChange?: (partial: Partial<InvoiceListQuery>) => void;
  onOpenInvoice: (invoiceId: string) => void;
};

export function InvoiceTableDesktop({
  rows,
  query,
  onSortChange,
  onOpenInvoice,
}: InvoiceTableDesktopProps) {
  function handleInvoiceRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    invoiceId: string,
  ) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onOpenInvoice(invoiceId);
  }

  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full min-w-[860px] table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-[220px]" />
          <col className="w-[30%]" />
          <col className="w-[14%]" />
          <col className="w-[16%]" />
          <col className="w-[12%]" />
          <col className="w-[14%]" />
        </colgroup>

        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <th className="py-4 pr-5 pl-6">Invoice</th>
            <th className="px-5 py-4">Client</th>

            <SortableInvoiceTableHeader
              label="Issue Date"
              sortKey="invoiceDate"
              query={query}
              onSortChange={onSortChange}
            />

            <SortableInvoiceTableHeader
              label="Due Date"
              sortKey="dueDate"
              query={query}
              onSortChange={onSortChange}
            />

            <th className="px-5 py-4">Status</th>

            <SortableInvoiceTableHeader
              label="Total"
              sortKey="totalAmount"
              query={query}
              onSortChange={onSortChange}
              className="justify-end"
            />
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr
              key={row.id}
              className="group cursor-pointer text-sm transition hover:bg-slate-50/70 focus:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-inset"
              tabIndex={0}
              title={`View invoice ${row.invoiceNumber}`}
              onClick={() => onOpenInvoice(row.id)}
              onKeyDown={(event) => handleInvoiceRowKeyDown(event, row.id)}
            >
              <td className="py-4 pr-5 pl-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-200">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </div>

                  <Link
                    to={row.detailPath}
                    className="font-mono text-sm font-bold text-slate-950 transition hover:text-slate-700 group-hover:text-slate-700"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {row.invoiceNumber}
                  </Link>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${row.customerAvatarClassName}`}
                  >
                    {row.customerInitials}
                  </div>

                  <span className="font-medium text-slate-900">
                    {row.customerName}
                  </span>
                </div>
              </td>

              <td className="px-5 py-4 text-slate-600">{row.invoiceDate}</td>

              <td className="px-5 py-4">
                {row.dueDate ? (
                  <div>
                    <p className="text-slate-600">{row.dueDate}</p>

                    {row.dueDateMeta ? (
                      <p
                        className={`mt-0.5 text-xs font-medium ${row.dueDateMeta.colorClassName}`}
                      >
                        {row.dueDateMeta.text}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <span className="text-slate-400">–</span>
                )}
              </td>

              <td className="px-5 py-4">
                <InvoiceStatusBadge status={row.status} />
              </td>

              <td className="px-5 py-4 text-right font-mono font-bold tabular-nums text-slate-950">
                {row.totalAmount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
