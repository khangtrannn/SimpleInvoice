import type { InvoiceListQuery } from '@/api/types';

import { InvoiceDateRangeFilter } from './InvoiceDateRangeFilter';
import { InvoiceFilterSearch } from './InvoiceFilterSearch';
import { InvoiceResetFiltersButton } from './InvoiceResetFiltersButton';
import { InvoiceSortFilter } from './InvoiceSortFilter';
import { InvoiceStatusFilter } from './InvoiceStatusFilter';

type InvoiceFiltersProps = {
  query: InvoiceListQuery;
  onChange: (query: Partial<InvoiceListQuery>) => void;
  onReset: () => void;
};

export function InvoiceFilters({
  query,
  onChange,
  onReset,
}: InvoiceFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3" aria-label="Invoice filters">
      <InvoiceFilterSearch keyword={query.keyword} onChange={onChange} />

      <InvoiceStatusFilter status={query.status} onChange={onChange} />

      <InvoiceDateRangeFilter
        fromDate={query.fromDate}
        toDate={query.toDate}
        onChange={onChange}
      />

      <InvoiceSortFilter
        sortBy={query.sortBy}
        ordering={query.ordering}
        onChange={onChange}
      />

      <InvoiceResetFiltersButton onReset={onReset} />
    </div>
  );
}
