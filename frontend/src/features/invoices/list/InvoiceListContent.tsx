import type { InvoiceListItem, InvoiceListQuery, Paging } from '@/api/types';
import {
  InvoiceFilters,
  InvoicePagination,
  InvoiceTable,
} from '@/features/invoices/list/components';

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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <InvoiceFilters
          query={query}
          onChange={onQueryChange}
          onReset={onQueryReset}
        />

        {paging && !isLoading && !isError ? (
          <p className="mt-3 text-xs font-medium text-slate-500">
            {paging.total} invoice{paging.total !== 1 ? 's' : ''} found
          </p>
        ) : null}
      </div>

      {isLoading ? <InvoiceListSkeleton /> : null}

      {isError ? (
        <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
          {errorMessage ?? 'Failed to load invoices.'}
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <>
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
