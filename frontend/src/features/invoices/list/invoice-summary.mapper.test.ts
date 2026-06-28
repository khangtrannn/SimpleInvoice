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
      total: '1,000.00',
      paid: '600.00',
      pending: '250.00',
      overdue: '150.00',
      draft: '0.00',
      draftCount: 0,
      totalHelper: 'Total revenue',
      paidHelper: '60% of total',
      pendingHelper: '25% of total',
      overdueHelper: '15% of total',
      draftHelper: '0 invoices',
    });
  });

  it('returns zero summary when API summary is null', () => {
    const summary = null;

    const result = buildTileSummary(summary);

    expect(result).toEqual({
      total: '0.00',
      paid: '0.00',
      pending: '0.00',
      overdue: '0.00',
      draft: '0.00',
      draftCount: 0,
      totalHelper: 'Total revenue',
      paidHelper: '—',
      pendingHelper: '—',
      overdueHelper: '—',
      draftHelper: '0 invoices',
    });
  });

  it('uses singular invoice label for one draft invoice', () => {
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

    expect(result.draftHelper).toBe('1 invoice');
  });
});
