import { FileSearch, Plus } from 'lucide-react';
import { Link } from 'react-router';

import { InvoiceFilters } from '@/features/invoices/components/InvoiceFilters';
import { InvoicePagination } from '@/features/invoices/components/InvoicePagination';
import { InvoiceTable } from '@/features/invoices/components/InvoiceTable';
import { useInvoiceListQuery } from '@/features/invoices/hooks/use-invoice-list-query';
import { useInvoices } from '@/features/invoices/hooks/use-invoices';
import { getApiErrorMessage } from '@/utils/api-error';

export function InvoiceListPage() {
  const { query, updateQuery, resetQuery } = useInvoiceListQuery();
  const invoicesQuery = useInvoices(query);

  const invoices = invoicesQuery.data?.data ?? [];
  const paging = invoicesQuery.data?.paging;

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, manage and monitor all your invoices in one place.
          </p>
        </div>

        <Link
          to="/invoices/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white shadow-md shadow-amber-600/30 transition hover:bg-amber-700 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Invoice
        </Link>
      </div>

      <InvoiceFilters query={query} onChange={updateQuery} onReset={resetQuery} />

      <div className="mt-3">
        {invoicesQuery.isLoading ? <InvoiceListSkeleton /> : null}

        {invoicesQuery.isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
            {getApiErrorMessage(invoicesQuery.error, 'Failed to load invoices.')}
          </div>
        ) : null}

        {!invoicesQuery.isLoading && !invoicesQuery.isError && invoices.length === 0 ? (
          <EmptyState />
        ) : null}

        {!invoicesQuery.isLoading && !invoicesQuery.isError && invoices.length > 0 ? (
          <div className={`transition-opacity duration-150 ${invoicesQuery.isFetching ? 'opacity-60' : 'opacity-100'}`}>
            <InvoiceTable invoices={invoices} />
            {paging ? (
              <InvoicePagination paging={paging} query={query} onChange={updateQuery} />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <FileSearch className="h-7 w-7 text-slate-400" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-900">No invoices found</h2>
      <p className="mt-1.5 max-w-xs text-sm text-slate-500">
        Try adjusting your search or filters, or create your first invoice.
      </p>
      <Link
        to="/invoices/new"
        className="mt-6 inline-flex h-9 items-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white shadow-md shadow-amber-600/30 transition hover:bg-amber-700"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create Invoice
      </Link>
    </div>
  );
}

function InvoiceListSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
  );
}
