import type { UseQueryResult } from '@tanstack/react-query';

import type { InvoiceListQuery, InvoiceListResponse } from '@/api/types';
import { InvoiceFilters } from '@/features/invoices/components/InvoiceFilters';
import { InvoicePagination } from '@/features/invoices/components/InvoicePagination';
import { InvoiceTable } from '@/features/invoices/components/InvoiceTable';
import { getApiErrorMessage } from '@/utils/api-error';

import { InvoiceListEmptyState } from './InvoiceListEmptyState';
import { InvoiceListSkeleton } from './InvoiceListSkeleton';

interface InvoiceListContentProps {
  invoicesQuery: UseQueryResult<InvoiceListResponse>;
  query: InvoiceListQuery;
  onQueryChange: (query: Partial<InvoiceListQuery>) => void;
  onQueryReset: () => void;
}

export function InvoiceListContent({
  invoicesQuery,
  query,
  onQueryChange,
  onQueryReset,
}: InvoiceListContentProps) {
  const invoices = invoicesQuery.data?.data ?? [];
  const paging = invoicesQuery.data?.paging;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Filter row */}
      <div className="border-b border-slate-200 p-5">
        <InvoiceFilters query={query} onChange={onQueryChange} onReset={onQueryReset} />
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

          {invoices.length === 0 ? <InvoiceListEmptyState /> : (
            <div className={`transition-opacity duration-150 ${invoicesQuery.isFetching ? 'opacity-60' : 'opacity-100'}`}>
              <InvoiceTable invoices={invoices} query={query} onSortChange={onQueryChange} />
              {paging ? (
                <InvoicePagination paging={paging} query={query} onChange={onQueryChange} />
              ) : null}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
