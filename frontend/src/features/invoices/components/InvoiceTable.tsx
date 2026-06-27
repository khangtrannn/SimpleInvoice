import { Link } from 'react-router';

import type { InvoiceListItem, InvoiceStatus } from '@/api/types';
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge';
import { formatDate, formatMoney } from '@/utils/format';

const statusRowAccent: Record<InvoiceStatus, string> = {
  Draft: 'border-l-slate-300',
  Pending: 'border-l-amber-400',
  Paid: 'border-l-emerald-500',
  Overdue: 'border-l-red-500',
};

type InvoiceTableProps = {
  invoices: InvoiceListItem[];
};

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-400 uppercase tracking-wider">
              <th className="pl-6 pr-5 py-3.5 font-medium">Invoice #</th>
              <th className="px-5 py-3.5 font-medium">Customer</th>
              <th className="px-5 py-3.5 font-medium">Invoice Date</th>
              <th className="px-5 py-3.5 font-medium">Due Date</th>
              <th className="px-5 py-3.5 font-medium">Amount</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className={`border-l-2 text-sm text-slate-700 transition hover:bg-slate-50/60 ${statusRowAccent[invoice.status]}`}
              >
                <td className="pl-5 pr-5 py-4">
                  <Link
                    to={`/invoices/${invoice.id}`}
                    className="inline-block rounded bg-[#0D1F3C]/[0.06] border border-[#0D1F3C]/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-[#0D1F3C] transition hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </td>
                <td className="px-5 py-4 font-medium text-slate-800">{invoice.customerName}</td>
                <td className="px-5 py-4 text-slate-500">{formatDate(invoice.invoiceDate)}</td>
                <td className="px-5 py-4 text-slate-500">{formatDate(invoice.dueDate)}</td>
                <td className="px-5 py-4 font-mono font-semibold tabular-nums text-[#0D1F3C]">
                  {formatMoney(invoice.totalAmount, invoice.currency, invoice.currencySymbol)}
                </td>
                <td className="px-5 py-4">
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 lg:hidden" aria-hidden="true">
        {invoices.map((invoice) => (
          <Link
            key={invoice.id}
            to={`/invoices/${invoice.id}`}
            aria-label={`Invoice for ${invoice.customerName}`}
            className={`block border-l-2 bg-white p-5 transition hover:bg-slate-50/60 ${statusRowAccent[invoice.status]}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-block rounded bg-[#0D1F3C]/[0.06] border border-[#0D1F3C]/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-[#0D1F3C]">{invoice.invoiceNumber}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-700">{invoice.customerName}</p>
              </div>
              <InvoiceStatusBadge status={invoice.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Invoice Date</p>
                <p className="mt-1 font-medium text-slate-800">{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Due Date</p>
                <p className="mt-1 font-medium text-slate-800">{formatDate(invoice.dueDate)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Total Amount</p>
                <p className="mt-1 font-mono font-bold tabular-nums text-[#0D1F3C]">
                  {formatMoney(invoice.totalAmount, invoice.currency, invoice.currencySymbol)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
