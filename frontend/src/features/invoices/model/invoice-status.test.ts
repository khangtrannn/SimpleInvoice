import { describe, expect, it } from 'vitest';

import {
  getInvoiceStatusConfig,
  INVOICE_STATUS_CONFIG,
} from './invoice-status';

describe('invoice status model', () => {
  it('defines config for every invoice status', () => {
    expect(Object.keys(INVOICE_STATUS_CONFIG)).toEqual([
      'Draft',
      'Pending',
      'Paid',
      'Overdue',
    ]);
  });

  it('returns draft status config', () => {
    const config = getInvoiceStatusConfig('Draft');

    expect(config).toEqual({
      label: 'Draft',
      badgeClassName: 'bg-white text-slate-700 ring-1 ring-slate-300',
      dotClassName: 'bg-slate-500',
    });
  });

  it('returns paid status config', () => {
    const config = getInvoiceStatusConfig('Paid');

    expect(config.label).toBe('Paid');
    expect(config.badgeClassName).toContain('text-emerald-700');
    expect(config.dotClassName).toBe('bg-emerald-500');
  });

  it('returns overdue status config', () => {
    const config = getInvoiceStatusConfig('Overdue');

    expect(config.label).toBe('Overdue');
    expect(config.badgeClassName).toContain('text-red-700');
    expect(config.dotClassName).toBe('bg-red-500');
  });
});
