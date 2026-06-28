import type { InvoiceListItem, InvoiceListQuery, Paging } from '@/api/types';
import { InvoiceFilters } from '@/features/invoices/components/InvoiceFilters';
import { InvoicePagination } from '@/features/invoices/components/InvoicePagination';
import { InvoiceTable } from '@/features/invoices/components/InvoiceTable';

import { InvoiceListEmptyState } from './InvoiceListEmptyState';
import { InvoiceListSkeleton } from './InvoiceListSkeleton';

type FiltersProps = {
  query: InvoiceListQuery;
  onChange: (query: Partial<InvoiceListQuery>) => void;
  onReset: () => void;
};

type BodyProps = {
  invoices: InvoiceListItem[];
  paging: Paging | undefined;
  query: InvoiceListQuery;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  onQueryChange: (query: Partial<InvoiceListQuery>) => void;
};

function Filters({ query, onChange, onReset }: FiltersProps) {
  return <InvoiceFilters query={query} onChange={onChange} onReset={onReset} />;
}

function Body({
  invoices,
  paging,
  query,
  isLoading,
  isFetching,
  isError,
  errorMessage,
  onQueryChange,
}: BodyProps) {
  if (isLoading) {
    return <InvoiceListSkeleton />;
  }

  if (isError) {
    return (
      <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
        {errorMessage ?? 'Failed to load invoices.'}
      </div>
    );
  }

  return (
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
  );
}

export const InvoiceListContent = {
  Filters,
  Body,
};
