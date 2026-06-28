import { AlertCircle, Clock3, FileSearch, FileText, Plus, ReceiptText, WalletCards } from 'lucide-react';
import { Link } from 'react-router';

import type { InvoiceSummary } from '@/api/types';
import { InvoiceFilters } from '@/features/invoices/components/InvoiceFilters';
import { InvoicePagination } from '@/features/invoices/components/InvoicePagination';
import { InvoiceTable } from '@/features/invoices/components/InvoiceTable';
import { useInvoiceListQuery } from '@/features/invoices/hooks/use-invoice-list-query';
import { useInvoices } from '@/features/invoices/hooks/use-invoices';
import { getApiErrorMessage } from '@/utils/api-error';
import { formatLineAmount } from '@/utils/format';

export function InvoiceListPage() {
  const { query, updateQuery, resetQuery } = useInvoiceListQuery();
  const invoicesQuery = useInvoices(query);

  const invoices = invoicesQuery.data?.data ?? [];
  const paging = invoicesQuery.data?.paging;
  const summary = buildTileSummary(invoicesQuery.data?.summary ?? null);
  const customers = [...new Set(invoices.map((inv) => inv.customerName))].sort();

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Invoices</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create, manage and monitor all your invoices in one place.
          </p>
        </div>

        <Link
          to="/invoices/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create Invoice
        </Link>
      </div>

      <InvoiceSummaryTiles summary={summary} />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* Filter row */}
        <div className="border-b border-slate-200 p-5">
          <InvoiceFilters query={query} onChange={updateQuery} onReset={resetQuery} customers={customers} />
        </div>

        {/* Loading */}
        {invoicesQuery.isLoading ? <InvoiceListSkeleton /> : null}

        {/* Error */}
        {invoicesQuery.isError ? (
          <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            {getApiErrorMessage(invoicesQuery.error, 'Failed to load invoices.')}
          </div>
        ) : null}

        {/* Loaded content */}
        {!invoicesQuery.isLoading && !invoicesQuery.isError ? (
          <>
            {paging ? (
              <div className="border-b border-slate-100 px-5 py-2.5">
                <p className="text-sm text-slate-500">
                  {paging.total} invoice{paging.total !== 1 ? 's' : ''} found
                </p>
              </div>
            ) : null}

            {invoices.length === 0 ? <EmptyState /> : (
              <div className={`transition-opacity duration-150 ${invoicesQuery.isFetching ? 'opacity-60' : 'opacity-100'}`}>
                <InvoiceTable invoices={invoices} query={query} onSortChange={updateQuery} />
                {paging ? (
                  <InvoicePagination paging={paging} query={query} onChange={updateQuery} />
                ) : null}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

type TileSummary = {
  total: string;
  paid: string;
  pending: string;
  overdue: string;
  draft: string;
  draftCount: number;
  totalHelper: string;
  paidHelper: string;
  pendingHelper: string;
  overdueHelper: string;
  draftHelper: string;
};

function buildTileSummary(summary: InvoiceSummary | null): TileSummary {
  const draftCount = summary?.draftCount ?? 0;

  const totalRevenue = Number(summary?.totalRevenue ?? 0);
  const totalPaid = Number(summary?.totalPaid ?? 0);
  const totalPending = Number(summary?.totalPending ?? 0);
  const totalOverdue = Number(summary?.totalOverdue ?? 0);
  const totalDraft = Number(summary?.totalDraft ?? 0);

  const pct = (val: number) =>
    totalRevenue > 0 ? `${Math.round((val / totalRevenue) * 100)}% of total` : '—';

  return {
    total: formatLineAmount(totalRevenue, ''),
    paid: formatLineAmount(totalPaid, ''),
    pending: formatLineAmount(totalPending, ''),
    overdue: formatLineAmount(totalOverdue, ''),
    draft: formatLineAmount(totalDraft, ''),
    draftCount,
    totalHelper: 'Total revenue',
    paidHelper: pct(totalPaid),
    pendingHelper: pct(totalPending),
    overdueHelper: pct(totalOverdue),
    draftHelper: `${draftCount} invoice${draftCount !== 1 ? 's' : ''}`,
  };
}

function InvoiceSummaryTiles({ summary }: { summary: TileSummary }) {
  const tiles = [
    {
      label: 'Total Revenue',
      value: summary.total,
      helper: summary.totalHelper,
      icon: ReceiptText,
    },
    {
      label: 'Paid',
      value: summary.paid,
      helper: summary.paidHelper,
      icon: WalletCards,
    },
    {
      label: 'Pending',
      value: summary.pending,
      helper: summary.pendingHelper,
      icon: Clock3,
    },
    {
      label: 'Overdue',
      value: summary.overdue,
      helper: summary.overdueHelper,
      icon: AlertCircle,
    },
    {
      label: 'Draft',
      value: summary.draft,
      helper: summary.draftHelper,
      icon: FileText,
    },
  ];

  return (
    <section aria-label="Invoice summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {tiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <article
            key={tile.label}
            className="flex min-h-28 items-center gap-5 rounded-lg border border-slate-200 bg-white px-6 py-5 shadow-sm"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-900">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600">{tile.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{tile.value}</p>
              <p className="mt-1 text-xs text-slate-500">{tile.helper}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100">
        <FileSearch className="h-7 w-7 text-slate-400" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-900">No invoices found</h2>
      <p className="mt-1.5 max-w-xs text-sm text-slate-500">
        Try changing your search or filters, or create your first invoice.
      </p>
      <Link
        to="/invoices/new"
        className="mt-6 inline-flex h-9 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-md shadow-slate-950/20 transition hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create Invoice
      </Link>
    </div>
  );
}

function InvoiceListSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden">
      {/* Desktop skeleton */}
      <div className="hidden lg:block">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-3.5">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-3 rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 px-6 py-4">
              <div className="h-4 rounded-full bg-slate-200" />
              <div className="h-4 rounded-full bg-slate-100" />
              <div className="h-4 w-3/4 rounded-full bg-slate-100" />
              <div className="h-4 w-3/4 rounded-full bg-slate-100" />
              <div className="h-4 rounded-full bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile card skeleton */}
      <div className="divide-y divide-slate-100 lg:hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="space-y-4 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-full bg-slate-200" />
                  <div className="h-3 w-32 rounded-full bg-slate-100" />
                </div>
              </div>
              <div className="h-6 w-16 rounded-full bg-slate-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="h-2.5 w-16 rounded-full bg-slate-100" />
                <div className="h-3.5 w-24 rounded-full bg-slate-200" />
              </div>
              <div className="space-y-2">
                <div className="h-2.5 w-16 rounded-full bg-slate-100" />
                <div className="h-3.5 w-24 rounded-full bg-slate-200" />
              </div>
              <div className="col-span-2 space-y-2">
                <div className="h-2.5 w-12 rounded-full bg-slate-100" />
                <div className="h-3.5 w-28 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
