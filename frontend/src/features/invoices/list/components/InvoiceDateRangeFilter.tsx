import { Calendar, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { InvoiceListQuery } from '@/api/types';
import { formatDate } from '@/utils/format';

type InvoiceDateRangeFilterProps = {
  fromDate?: string;
  toDate?: string;
  onChange: (query: Partial<InvoiceListQuery>) => void;
};

export function InvoiceDateRangeFilter({
  fromDate,
  toDate,
  onChange,
}: InvoiceDateRangeFilterProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setDatePickerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const dateLabel =
    fromDate || toDate
      ? `${fromDate ? formatDate(fromDate) : '…'} – ${
          toDate ? formatDate(toDate) : '…'
        }`
      : 'All dates';

  return (
    <div ref={datePickerRef} className="relative w-full sm:w-auto">
      <p className="mb-1.5 text-xs font-medium text-slate-500">Date range</p>

      <button
        type="button"
        onClick={() => setDatePickerOpen((isOpen) => !isOpen)}
        className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 sm:w-auto sm:justify-start"
      >
        <Calendar
          className="h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        />

        <span className="whitespace-nowrap">{dateLabel}</span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            datePickerOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {datePickerOpen ? (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">
                From
              </span>

              <input
                type="date"
                value={fromDate ?? ''}
                onChange={(event) =>
                  onChange({
                    fromDate: event.target.value || undefined,
                    page: 1,
                  })
                }
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">
                To
              </span>

              <input
                type="date"
                value={toDate ?? ''}
                onChange={(event) =>
                  onChange({
                    toDate: event.target.value || undefined,
                    page: 1,
                  })
                }
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </label>
          </div>

          {fromDate || toDate ? (
            <button
              type="button"
              onClick={() => {
                onChange({
                  fromDate: undefined,
                  toDate: undefined,
                  page: 1,
                });
                setDatePickerOpen(false);
              }}
              className="mt-3 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Clear dates
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
