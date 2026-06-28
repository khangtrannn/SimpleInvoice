import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { InvoiceListQuery, Paging } from '@/api/types';

type InvoicePaginationProps = {
  paging: Paging;
  query: InvoiceListQuery;
  onChange: (query: Partial<InvoiceListQuery>) => void;
};

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];
  const low = Math.max(2, current - 1);
  const high = Math.min(total - 1, current + 1);

  if (low > 2) pages.push('...');
  for (let p = low; p <= high; p++) pages.push(p);
  if (high < total - 1) pages.push('...');

  pages.push(total);
  return pages;
}

export function InvoicePagination({ paging, query, onChange }: InvoicePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(paging.total / paging.pageSize));
  const startResult = paging.total === 0 ? 0 : (paging.page - 1) * paging.pageSize + 1;
  const endResult = Math.min(paging.page * paging.pageSize, paging.total);
  const pages = getPageNumbers(paging.page, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-600">
        Showing {startResult} to {endResult} of {paging.total} invoices
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={paging.page <= 1}
            onClick={() => onChange({ page: paging.page - 1 })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {pages.map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-sm text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onChange({ page })}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                  page === paging.page
                    ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                    : 'border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            disabled={paging.page >= totalPages}
            onClick={() => onChange({ page: paging.page + 1 })}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <label className="flex items-center gap-1.5 text-sm text-slate-600">
          <select
            aria-label="Rows per page"
            value={query.pageSize}
            onChange={(event) => onChange({ pageSize: Number(event.target.value), page: 1 })}
            className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="font-medium text-slate-500">/ page</span>
        </label>
      </div>
    </div>
  );
}
