import type {
  InvoiceSortBy,
  InvoiceStatus,
  InvoiceStatusFilter,
  Ordering,
} from '@/api/types';

export type InvoiceStatusOption = {
  label: string;
  value: InvoiceStatusFilter;
};

export type InvoiceSortOption = {
  label: string;
  sortBy: InvoiceSortBy;
  ordering: Ordering;
};

export const INVOICE_STATUS_OPTIONS: InvoiceStatusOption[] = [
  { label: 'All status', value: 'All' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Overdue', value: 'Overdue' },
];

export const INVOICE_SORT_OPTIONS: InvoiceSortOption[] = [
  { label: 'Newest first', sortBy: 'createdAt', ordering: 'DESC' },
  { label: 'Oldest first', sortBy: 'createdAt', ordering: 'ASC' },
  { label: 'Issue date: Newest', sortBy: 'invoiceDate', ordering: 'DESC' },
  { label: 'Issue date: Oldest', sortBy: 'invoiceDate', ordering: 'ASC' },
  { label: 'Due date: Soonest', sortBy: 'dueDate', ordering: 'ASC' },
  { label: 'Due date: Latest', sortBy: 'dueDate', ordering: 'DESC' },
  { label: 'Amount: High to Low', sortBy: 'totalAmount', ordering: 'DESC' },
  { label: 'Amount: Low to High', sortBy: 'totalAmount', ordering: 'ASC' },
];

export function getActiveInvoiceSortLabel({
  sortBy,
  ordering,
}: {
  sortBy?: InvoiceSortBy;
  ordering?: Ordering;
}) {
  return (
    INVOICE_SORT_OPTIONS.find(
      (option) => option.sortBy === sortBy && option.ordering === ordering,
    )?.label ?? INVOICE_SORT_OPTIONS[0].label
  );
}

export function getInvoiceSortOptionByLabel(label: string) {
  return INVOICE_SORT_OPTIONS.find((option) => option.label === label);
}

export function isInvoiceStatus(value: string): value is InvoiceStatus {
  return (
    value === 'Draft' ||
    value === 'Pending' ||
    value === 'Paid' ||
    value === 'Overdue'
  );
}
