import { describe, expect, it } from 'vitest';

import type { InvoiceSummary } from '@/api/types';

import { buildTileSummary } from './invoice-summary.mapper';

describe('buildTileSummary', () => {
  it('builds formatted summary tile data from API summary', () => {
    const summary: InvoiceSummary = {
      totalRevenue: '1000',
      totalPaid: '600',
      totalPending: '250',
      totalOverdue: '150',
      totalDraft: '0',
      paidCount: 3,
      pendingCount: 2,
      overdueCount: 1,
      draftCount: 0,
      currency: 'AUD',
      currencySymbol: 'AU$',
      currencyCount: 1,
    };

    const result = buildTileSummary(summary);

    expect(result).toEqual({
      totalInvoices: 6,
      totalInvoicesHelper: '0 drafts',
      outstanding: '400.00',
      outstandingHelper: '3 invoices unpaid',
      paid: '600.00',
      paidHelper: '3 invoices paid',
      overdue: '150.00',
      overdueHelper: '1 invoice overdue',
    });
  });

  it('returns zero summary when API summary is null', () => {
    const summary = null;

    const result = buildTileSummary(summary);

    expect(result).toEqual({
      totalInvoices: 0,
      totalInvoicesHelper: '0 drafts',
      outstanding: '0.00',
      outstandingHelper: '0 invoices unpaid',
      paid: '0.00',
      paidHelper: '0 invoices paid',
      overdue: '0.00',
      overdueHelper: '0 invoices overdue',
    });
  });

  it('uses singular invoice label for a single draft invoice', () => {
    const summary: InvoiceSummary = {
      totalRevenue: '0',
      totalPaid: '0',
      totalPending: '0',
      totalOverdue: '0',
      totalDraft: '100',
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0,
      draftCount: 1,
      currency: 'AUD',
      currencySymbol: 'AU$',
      currencyCount: 1,
    };

    const result = buildTileSummary(summary);

    expect(result.totalInvoicesHelper).toBe('1 draft');
    expect(result.totalInvoices).toBe(1);
  });
});
