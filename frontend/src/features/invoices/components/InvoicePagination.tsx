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
    <div className="flex flex-col gap-3 rounded-b-2xl border-x border-b border-slate-200 bg-white px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        <span className="font-semibold text-slate-700">{startResult}–{endResult}</span>
        {' '}of{' '}
        <span className="font-semibold text-slate-700">{paging.total}</span> results
      </p>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-slate-500">
          <span className="hidden sm:inline">Per page</span>
          <select
            value={query.pageSize}
            onChange={(event) => onChange({ pageSize: Number(event.target.value), page: 1 })}
            className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={paging.page <= 1}
            onClick={() => onChange({ page: paging.page - 1 })}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          {pages.map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="flex h-7 w-7 items-center justify-center text-xs text-slate-400">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => onChange({ page })}
                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                  page === paging.page
                    ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50'
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
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
