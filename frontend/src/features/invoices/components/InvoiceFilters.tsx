import { ArrowUpDown, Calendar, ChevronDown, RotateCcw, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { InvoiceListQuery, InvoiceSortBy, InvoiceStatus, InvoiceStatusFilter, Ordering } from '@/api/types';
import { formatDate } from '@/utils/format';

type SortOption = { label: string; sortBy: InvoiceSortBy; ordering: Ordering };

const sortOptions: SortOption[] = [
  { label: 'Newest first', sortBy: 'createdAt', ordering: 'DESC' },
  { label: 'Oldest first', sortBy: 'createdAt', ordering: 'ASC' },
  { label: 'Issue date: Newest', sortBy: 'invoiceDate', ordering: 'DESC' },
  { label: 'Issue date: Oldest', sortBy: 'invoiceDate', ordering: 'ASC' },
  { label: 'Due date: Soonest', sortBy: 'dueDate', ordering: 'ASC' },
  { label: 'Due date: Latest', sortBy: 'dueDate', ordering: 'DESC' },
  { label: 'Amount: High to Low', sortBy: 'totalAmount', ordering: 'DESC' },
  { label: 'Amount: Low to High', sortBy: 'totalAmount', ordering: 'ASC' },
];

type InvoiceFiltersProps = {
  query: InvoiceListQuery;
  onChange: (query: Partial<InvoiceListQuery>) => void;
  onReset: () => void;
};

export function InvoiceFilters({ query, onChange, onReset }: InvoiceFiltersProps) {
  const [keyword, setKeyword] = useState(query.keyword ?? '');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setDatePickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if ((query.keyword ?? '') !== keyword.trim()) {
        onChange({ keyword: keyword.trim() || undefined, page: 1 });
      }
    }, 400);
    return () => window.clearTimeout(id);
  }, [keyword, onChange, query.keyword]);

  function handleKeywordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(e.target.value);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value as InvoiceStatusFilter;
    onChange({ status: val === 'All' ? undefined : (val as InvoiceStatus), page: 1 });
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const option = sortOptions.find((o) => o.label === e.target.value);
    if (option) onChange({ sortBy: option.sortBy, ordering: option.ordering, page: 1 });
  }

  function handleReset() {
    setKeyword('');
    setDatePickerOpen(false);
    onReset();
  }

  const activeSortLabel =
    sortOptions.find((o) => o.sortBy === query.sortBy && o.ordering === query.ordering)?.label ??
    sortOptions[0].label;

  const dateLabel =
    query.fromDate || query.toDate
      ? `${query.fromDate ? formatDate(query.fromDate) : '…'} – ${query.toDate ? formatDate(query.toDate) : '…'}`
      : 'All dates';

  return (
    <div className="flex flex-wrap items-end gap-3" aria-label="Invoice filters">
      {/* Search */}
      <div className="w-full sm:min-w-[200px] sm:flex-[2]">
        <p className="mb-1.5 text-xs font-medium text-slate-500">Search</p>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Search by invoice number or customer name..."
            className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </div>
      </div>

      {/* Status */}
      <div className="w-full sm:w-auto">
        <p className="mb-1.5 text-xs font-medium text-slate-500">Status</p>
        <div className="relative">
          <select
            value={query.status ?? 'All'}
            onChange={handleStatusChange}
            className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:w-36"
          >
            <option value="All">All status</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Date range */}
      <div ref={datePickerRef} className="relative w-full sm:w-auto">
        <p className="mb-1.5 text-xs font-medium text-slate-500">Date range</p>
        <button
          type="button"
          onClick={() => setDatePickerOpen((v) => !v)}
          className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 sm:w-auto sm:justify-start"
        >
          <Calendar className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="whitespace-nowrap">{dateLabel}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${datePickerOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {datePickerOpen && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">From</span>
                <input
                  type="date"
                  value={query.fromDate ?? ''}
                  onChange={(e) => onChange({ fromDate: e.target.value || undefined, page: 1 })}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">To</span>
                <input
                  type="date"
                  value={query.toDate ?? ''}
                  onChange={(e) => onChange({ toDate: e.target.value || undefined, page: 1 })}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </label>
            </div>
            {(query.fromDate || query.toDate) && (
              <button
                type="button"
                onClick={() => {
                  onChange({ fromDate: undefined, toDate: undefined, page: 1 });
                  setDatePickerOpen(false);
                }}
                className="mt-3 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Clear dates
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sort by */}
      <div className="w-full sm:w-auto">
        <p className="mb-1.5 text-xs font-medium text-slate-500">Sort by</p>
        <div className="relative">
          <ArrowUpDown
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <select
            value={activeSortLabel}
            onChange={handleSortChange}
            className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:w-48"
          >
            {sortOptions.map((o) => (
              <option key={o.label} value={o.label}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={handleReset}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:w-11 sm:shrink-0"
        aria-label="Reset filters"
        title="Reset filters"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-medium sm:hidden">Reset filters</span>
      </button>
    </div>
  );
}
