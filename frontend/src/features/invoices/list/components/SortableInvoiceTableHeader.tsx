import { ChevronsUpDown } from 'lucide-react';

import type { InvoiceListQuery, InvoiceSortBy } from '@/api/types';

type SortableInvoiceTableHeaderProps = {
  label: string;
  sortKey: InvoiceSortBy;
  query?: InvoiceListQuery;
  onSortChange?: (partial: Partial<InvoiceListQuery>) => void;
  className?: string;
};

export function SortableInvoiceTableHeader({
  label,
  sortKey,
  query,
  onSortChange,
  className,
}: SortableInvoiceTableHeaderProps) {
  const isActive = query?.sortBy === sortKey;

  function handleClick() {
    if (!onSortChange) {
      return;
    }

    const nextOrdering =
      isActive && query?.ordering === 'DESC' ? 'ASC' : 'DESC';

    onSortChange({
      sortBy: sortKey,
      ordering: nextOrdering,
      page: 1,
    });
  }

  return (
    <th
      className={`px-5 py-4 ${
        onSortChange ? 'cursor-pointer select-none hover:text-slate-700' : ''
      }`}
      onClick={handleClick}
    >
      <div className={`flex items-center gap-1 ${className ?? ''}`}>
        {label}

        <ChevronsUpDown
          className={`h-3.5 w-3.5 ${
            isActive ? 'text-slate-700' : 'text-slate-400'
          }`}
          aria-hidden="true"
        />
      </div>
    </th>
  );
}
