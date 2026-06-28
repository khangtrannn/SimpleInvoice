import { ChevronDown } from 'lucide-react';

import type {
  InvoiceListQuery,
  InvoiceStatus,
  InvoiceStatusFilter,
} from '@/api/types';

import {
  INVOICE_STATUS_OPTIONS,
  isInvoiceStatus,
} from './invoice-filter-options';

type InvoiceStatusFilterProps = {
  status?: InvoiceStatus;
  onChange: (query: Partial<InvoiceListQuery>) => void;
};

export function InvoiceStatusFilter({
  status,
  onChange,
}: InvoiceStatusFilterProps) {
  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as InvoiceStatusFilter;

    onChange({
      status: isInvoiceStatus(value) ? value : undefined,
      page: 1,
    });
  }

  return (
    <div className="w-full sm:w-auto">
      <p className="mb-1.5 text-xs font-medium text-slate-500">Status</p>

      <div className="relative">
        <select
          value={status ?? 'All'}
          onChange={handleStatusChange}
          aria-label="Status"
          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-9 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:w-36"
        >
          {INVOICE_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
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
