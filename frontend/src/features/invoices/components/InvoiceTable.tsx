import { ChevronsUpDown, FileText } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router';

import type { InvoiceListItem, InvoiceListQuery, InvoiceSortBy } from '@/api/types';
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge';
import { formatDate, formatLineAmount } from '@/utils/format';

type InvoiceTableProps = {
  invoices: InvoiceListItem[];
  query?: InvoiceListQuery;
  onSortChange?: (partial: Partial<InvoiceListQuery>) => void;
};

const avatarColors = [
  'bg-slate-200 text-slate-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  return avatarColors[hash % avatarColors.length];
}

function getDaysLeft(dueDate: string | undefined | null): { text: string; color: string } | null {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  const days = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { text: `${Math.abs(days)} days overdue`, color: 'text-red-500' };
  if (days === 0) return { text: 'Due today', color: 'text-amber-600' };
  if (days <= 7) return { text: `${days} days left`, color: 'text-amber-500' };
  return { text: `${days} days left`, color: 'text-slate-400' };
}

type SortableThProps = {
  label: string;
  sortKey: InvoiceSortBy;
  query?: InvoiceListQuery;
  onSortChange?: (partial: Partial<InvoiceListQuery>) => void;
  className?: string;
};

function SortableTh({ label, sortKey, query, onSortChange, className }: SortableThProps) {
  const isActive = query?.sortBy === sortKey;

  function handleClick() {
    if (!onSortChange) return;
    const nextOrdering = isActive && query?.ordering === 'DESC' ? 'ASC' : 'DESC';
    onSortChange({ sortBy: sortKey, ordering: nextOrdering, page: 1 });
  }

  return (
    <th
      className={`px-5 py-4 ${onSortChange ? 'cursor-pointer select-none hover:text-slate-700' : ''}`}
      onClick={handleClick}
    >
      <div className={`flex items-center gap-1 ${className ?? ''}`}>
        {label}
        <ChevronsUpDown
          className={`h-3.5 w-3.5 ${isActive ? 'text-slate-700' : 'text-slate-400'}`}
          aria-hidden="true"
        />
      </div>
    </th>
  );
}

export function InvoiceTable({ invoices, query, onSortChange }: InvoiceTableProps) {
  const navigate = useNavigate();

  function openInvoice(invoiceId: string) {
    navigate(`/invoices/${invoiceId}`);
  }

  function handleInvoiceRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, invoiceId: string) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openInvoice(invoiceId);
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop table */}
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
              <th className="py-4 pl-6 pr-5">Invoice</th>
              <th className="px-5 py-4">Client</th>
              <SortableTh
                label="Issue Date"
                sortKey="invoiceDate"
                query={query}
                onSortChange={onSortChange}
              />
              <SortableTh
                label="Due Date"
                sortKey="dueDate"
                query={query}
                onSortChange={onSortChange}
              />
              <th className="px-5 py-4">Status</th>
              <SortableTh
                label="Total"
                sortKey="totalAmount"
                query={query}
                onSortChange={onSortChange}
                className="justify-end"
              />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => {
              const daysLeft = getDaysLeft(invoice.dueDate);
              const initials = getInitials(invoice.customerName);
              const avatarColor = getAvatarColor(invoice.customerName);

              return (
                <tr
                  key={invoice.id}
                  className="group cursor-pointer text-sm transition hover:bg-slate-50/70 focus:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-inset"
                  tabIndex={0}
                  title={`View invoice ${invoice.invoiceNumber}`}
                  onClick={() => openInvoice(invoice.id)}
                  onKeyDown={(event) => handleInvoiceRowKeyDown(event, invoice.id)}
                >
                  <td className="py-4 pl-6 pr-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-200">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="font-mono text-sm font-bold text-slate-950 transition hover:text-slate-700 group-hover:text-slate-700"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {invoice.invoiceNumber}
                      </Link>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor}`}
                      >
                        {initials}
                      </div>
                      <span className="font-medium text-slate-900">{invoice.customerName}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">{formatDate(invoice.invoiceDate)}</td>

                  <td className="px-5 py-4">
                    {invoice.dueDate ? (
                      <div>
                        <p className="text-slate-600">{formatDate(invoice.dueDate)}</p>
                        {daysLeft && (
                          <p className={`mt-0.5 text-xs font-medium ${daysLeft.color}`}>
                            {daysLeft.text}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">–</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>

                  <td className="px-5 py-4 text-right font-mono font-bold tabular-nums text-slate-950">
                    {formatLineAmount(invoice.totalAmount, invoice.currencySymbol)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-slate-100 lg:hidden">
        {invoices.map((invoice) => {
          const daysLeft = getDaysLeft(invoice.dueDate);
          const initials = getInitials(invoice.customerName);
          const avatarColor = getAvatarColor(invoice.customerName);

          return (
            <Link
              key={invoice.id}
              to={`/invoices/${invoice.id}`}
              className="block bg-white p-5 transition hover:bg-slate-50/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor}`}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold text-slate-950">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">{invoice.customerName}</p>
                  </div>
                </div>
                <InvoiceStatusBadge status={invoice.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs tracking-wide text-slate-400 uppercase">Issue Date</p>
                  <p className="mt-1 font-medium text-slate-700">{formatDate(invoice.invoiceDate)}</p>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-slate-400 uppercase">Due Date</p>
                  {invoice.dueDate ? (
                    <>
                      <p className="mt-1 font-medium text-slate-700">{formatDate(invoice.dueDate)}</p>
                      {daysLeft && (
                        <p className={`text-xs ${daysLeft.color}`}>{daysLeft.text}</p>
                      )}
                    </>
                  ) : (
                    <p className="mt-1 text-slate-400">–</p>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-xs tracking-wide text-slate-400 uppercase">Total</p>
                  <p className="mt-1 font-mono font-bold tabular-nums text-slate-950">
                    {formatLineAmount(invoice.totalAmount, invoice.currencySymbol)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
