import type { InvoiceListItem, InvoiceListQuery, Paging } from '@/api/types';
import { InvoiceFilters } from '@/features/invoices/components/InvoiceFilters';
import { InvoicePagination } from '@/features/invoices/components/InvoicePagination';
import { InvoiceTable } from '@/features/invoices/list/components';

import { InvoiceListEmptyState } from './InvoiceListEmptyState';
import { InvoiceListSkeleton } from './InvoiceListSkeleton';

type InvoiceListContentProps = {
  invoices: InvoiceListItem[];
  paging: Paging | undefined;
  query: InvoiceListQuery;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onQueryChange: (query: Partial<InvoiceListQuery>) => void;
  onQueryReset: () => void;
};

export function InvoiceListContent({
  invoices,
  paging,
  query,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  onQueryChange,
  onQueryReset,
}: InvoiceListContentProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <InvoiceFilters
          query={query}
          onChange={onQueryChange}
          onReset={onQueryReset}
        />
      </div>

      {isLoading ? <InvoiceListSkeleton /> : null}

      {isError ? (
        <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
          {errorMessage ?? 'Failed to load invoices.'}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <>
          {paging ? (
            <div className="border-b border-slate-100 px-5 py-2.5">
              <p className="text-sm text-slate-500">
                {paging.total} invoice{paging.total !== 1 ? 's' : ''} found
              </p>
            </div>
          ) : null}

          {invoices.length === 0 ? (
            <InvoiceListEmptyState />
          ) : (
            <div
              className={`transition-opacity duration-150 ${
                isFetching ? 'opacity-60' : 'opacity-100'
              }`}
            >
              <InvoiceTable
                invoices={invoices}
                query={query}
                onSortChange={onQueryChange}
              />

              {paging ? (
                <InvoicePagination
                  paging={paging}
                  query={query}
                  onChange={onQueryChange}
                />
              ) : null}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
