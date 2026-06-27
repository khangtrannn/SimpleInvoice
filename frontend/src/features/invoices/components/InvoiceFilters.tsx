import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle2,
  Clock3,
  FileText,
  LayoutList,
  RotateCcw,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import type {
  InvoiceListQuery,
  InvoiceSortBy,
  InvoiceStatus,
  InvoiceStatusFilter,
  Ordering,
} from '@/api/types';

const statusOptions: Array<{
  label: string;
  value: InvoiceStatusFilter;
  icon: typeof LayoutList;
}> = [
  { label: 'All', value: 'All', icon: LayoutList },
  { label: 'Draft', value: 'Draft', icon: FileText },
  { label: 'Pending', value: 'Pending', icon: Clock3 },
  { label: 'Paid', value: 'Paid', icon: CheckCircle2 },
  { label: 'Overdue', value: 'Overdue', icon: AlertCircle },
];

const statusActiveColors: Record<InvoiceStatusFilter, string> = {
  All: 'bg-[#0D1F3C] text-white shadow-sm',
  Draft: 'bg-slate-500 text-white shadow-sm',
  Pending: 'bg-amber-600 text-white shadow-sm',
  Paid: 'bg-emerald-600 text-white shadow-sm',
  Overdue: 'bg-red-600 text-white shadow-sm',
};

type InvoiceFiltersProps = {
  query: InvoiceListQuery;
  onChange: (query: Partial<InvoiceListQuery>) => void;
  onReset: () => void;
};

export function InvoiceFilters({ query, onChange, onReset }: InvoiceFiltersProps) {
  const [keyword, setKeyword] = useState(query.keyword ?? '');

  useEffect(() => {
    setKeyword(query.keyword ?? '');
  }, [query.keyword]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if ((query.keyword ?? '') !== keyword.trim()) {
        onChange({ keyword: keyword.trim() || undefined, page: 1 });
      }
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [keyword, onChange, query.keyword]);

  function handleStatusChange(status: InvoiceStatusFilter) {
    onChange({
      status: status === 'All' ? undefined : (status as InvoiceStatus),
      page: 1,
    });
  }

  function handleSortByChange(sortBy: InvoiceSortBy) {
    onChange({ sortBy, page: 1 });
  }

  function handleOrderingChange(ordering: Ordering) {
    onChange({ ordering, page: 1 });
  }

  const activeStatus: InvoiceStatusFilter = query.status ?? 'All';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Row 1: Search + Date range */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search invoice number or customer…"
            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" aria-hidden="true" />
          <input
            type="date"
            value={query.fromDate ?? ''}
            onChange={(event) => onChange({ fromDate: event.target.value || undefined, page: 1 })}
            className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            aria-label="From date"
          />
          <span className="text-xs text-slate-300">—</span>
          <input
            type="date"
            value={query.toDate ?? ''}
            onChange={(event) => onChange({ toDate: event.target.value || undefined, page: 1 })}
            className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            aria-label="To date"
          />
        </div>
      </div>

      {/* Row 2: Status tabs + Sort + Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
        <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isActive = activeStatus === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleStatusChange(option.value)}
                className={`inline-flex h-6 items-center gap-1 rounded-md px-2.5 text-[11px] font-semibold transition-all ${
                  isActive
                    ? statusActiveColors[option.value]
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={query.sortBy}
            onChange={(event) => handleSortByChange(event.target.value as InvoiceSortBy)}
            className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 shadow-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          >
            <option value="invoiceDate">Invoice Date</option>
            <option value="dueDate">Due Date</option>
            <option value="totalAmount">Amount</option>
          </select>

          <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              title="Descending"
              onClick={() => handleOrderingChange('DESC')}
              className={`flex h-7 w-7 items-center justify-center transition ${
                query.ordering === 'DESC'
                  ? 'bg-[#0D1F3C] text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <ArrowDown className="h-3 w-3" aria-hidden="true" />
            </button>
            <button
              type="button"
              title="Ascending"
              onClick={() => handleOrderingChange('ASC')}
              className={`flex h-7 w-7 items-center justify-center border-l border-slate-200 transition ${
                query.ordering === 'ASC'
                  ? 'bg-[#0D1F3C] text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <ArrowUp className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
