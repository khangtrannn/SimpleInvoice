import { describe, expect, it } from 'vitest';

import {
  getActiveInvoiceSortLabel,
  getInvoiceSortOptionByLabel,
  isInvoiceStatus,
} from './invoice-filter-options';

describe('invoice filter options', () => {
  it('returns active sort label from sort field and ordering', () => {
    expect(
      getActiveInvoiceSortLabel({
        sortBy: 'dueDate',
        ordering: 'ASC',
      }),
    ).toBe('Due date: Soonest');
  });

  it('falls back to default sort label when sort state is missing', () => {
    expect(
      getActiveInvoiceSortLabel({
        sortBy: undefined,
        ordering: undefined,
      }),
    ).toBe('Newest first');
  });

  it('finds sort option by label', () => {
    expect(getInvoiceSortOptionByLabel('Amount: High to Low')).toEqual({
      label: 'Amount: High to Low',
      sortBy: 'totalAmount',
      ordering: 'DESC',
    });
  });

  it('validates invoice status values', () => {
    expect(isInvoiceStatus('Draft')).toBe(true);
    expect(isInvoiceStatus('Pending')).toBe(true);
    expect(isInvoiceStatus('Paid')).toBe(true);
    expect(isInvoiceStatus('Overdue')).toBe(true);
    expect(isInvoiceStatus('All')).toBe(false);
    expect(isInvoiceStatus('Archived')).toBe(false);
  });
});
