import { describe, expect, it } from 'vitest';

import type { InvoiceListItem } from '@/api/types';

import {
  getCustomerAvatarClassName,
  getCustomerInitials,
  getInvoiceDueDateMeta,
  getInvoiceTableRowViewModel,
} from './invoice-table.mapper';

describe('getCustomerInitials', () => {
  it('returns initials for a multi-word customer name', () => {
    expect(getCustomerInitials('Acme Corporation')).toBe('AC');
  });

  it('returns first two letters for a single-word customer name', () => {
    expect(getCustomerInitials('Acme')).toBe('AC');
  });

  it('handles extra spaces', () => {
    expect(getCustomerInitials('  Acme   Corporation  ')).toBe('AC');
  });

  it('returns fallback for empty name', () => {
    expect(getCustomerInitials('')).toBe('?');
  });
});

describe('getCustomerAvatarClassName', () => {
  it('returns a deterministic avatar class for the same customer name', () => {
    const firstResult = getCustomerAvatarClassName('Acme Corporation');
    const secondResult = getCustomerAvatarClassName('Acme Corporation');

    expect(firstResult).toBe(secondResult);
  });

  it('returns default avatar class for empty customer name', () => {
    expect(getCustomerAvatarClassName('')).toBe('bg-slate-200 text-slate-700');
  });
});

describe('getInvoiceDueDateMeta', () => {
  const today = new Date('2026-06-28T00:00:00.000Z');

  it('returns overdue label for past due date', () => {
    const result = getInvoiceDueDateMeta('2026-06-25', today);

    expect(result).toEqual({
      text: '3 days overdue',
      colorClassName: 'text-red-500',
    });
  });

  it('returns due today label', () => {
    const result = getInvoiceDueDateMeta('2026-06-28', today);

    expect(result).toEqual({
      text: 'Due today',
      colorClassName: 'text-amber-600',
    });
  });

  it('returns warning label for due date within seven days', () => {
    const result = getInvoiceDueDateMeta('2026-07-03', today);

    expect(result).toEqual({
      text: '5 days left',
      colorClassName: 'text-amber-500',
    });
  });

  it('returns neutral label for due date after seven days', () => {
    const result = getInvoiceDueDateMeta('2026-07-10', today);

    expect(result).toEqual({
      text: '12 days left',
      colorClassName: 'text-slate-400',
    });
  });

  it('returns null when due date is missing', () => {
    expect(getInvoiceDueDateMeta(null, today)).toBeNull();
    expect(getInvoiceDueDateMeta(undefined, today)).toBeNull();
  });
});

describe('getInvoiceTableRowViewModel', () => {
  it('maps invoice list item into table row view model', () => {
    const invoice = createInvoiceListItem();

    const result = getInvoiceTableRowViewModel(
      invoice,
      new Date('2026-06-28T00:00:00.000Z'),
    );

    expect(result).toMatchObject({
      id: 'invoice-1',
      invoiceNumber: 'INV-2026-001',
      customerName: 'Acme Corporation',
      customerInitials: 'AC',
      invoiceDate: 'Jun 28, 2026',
      dueDate: 'Jul 3, 2026',
      totalAmount: 'AU$1,250.00',
      status: 'Pending',
      detailPath: '/invoices/invoice-1',
    });

    expect(result.dueDateMeta).toEqual({
      text: '5 days left',
      colorClassName: 'text-amber-500',
    });
  });
});

function createInvoiceListItem(
  overrides: Partial<InvoiceListItem> = {},
): InvoiceListItem {
  return {
    id: 'invoice-1',
    invoiceNumber: 'INV-2026-001',
    customerName: 'Acme Corporation',
    invoiceDate: '2026-06-28',
    dueDate: '2026-07-03',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '1250.00',
    status: 'Pending',
    ...overrides,
  };
}
