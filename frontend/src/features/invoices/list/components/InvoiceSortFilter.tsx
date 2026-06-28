import { ArrowUpDown, ChevronDown } from 'lucide-react';

import type { InvoiceListQuery, InvoiceSortBy, Ordering } from '@/api/types';

import {
  getActiveInvoiceSortLabel,
  getInvoiceSortOptionByLabel,
  INVOICE_SORT_OPTIONS,
} from './invoice-filter-options';

type InvoiceSortFilterProps = {
  sortBy?: InvoiceSortBy;
  ordering?: Ordering;
  onChange: (query: Partial<InvoiceListQuery>) => void;
};

export function InvoiceSortFilter({
  sortBy,
  ordering,
  onChange,
}: InvoiceSortFilterProps) {
  const activeSortLabel = getActiveInvoiceSortLabel({
    sortBy,
    ordering,
  });

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const option = getInvoiceSortOptionByLabel(event.target.value);

    if (!option) {
      return;
    }

    onChange({
      sortBy: option.sortBy,
      ordering: option.ordering,
      page: 1,
    });
  }

  return (
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
          aria-label="Sort by"
          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:w-48"
        >
          {INVOICE_SORT_OPTIONS.map((option) => (
            <option key={option.label} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
