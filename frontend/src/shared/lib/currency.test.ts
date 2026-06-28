import { describe, expect, it } from 'vitest';

import { getCurrencyLabel, getCurrencyOption } from './currency';

describe('getCurrencyOption', () => {
  it('returns the matching currency option', () => {
    expect(getCurrencyOption('GBP')).toMatchObject({
      code: 'GBP',
      symbol: '£',
    });
  });

  it('falls back to the first option for an unknown currency', () => {
    expect(getCurrencyOption('XYZ' as never).code).toBe('AUD');
  });
});

describe('getCurrencyLabel', () => {
  it('returns the label for a known currency', () => {
    expect(getCurrencyLabel('USD')).toBe('USD - US Dollar');
  });

  it('returns the raw code for an unknown currency', () => {
    expect(getCurrencyLabel('XYZ')).toBe('XYZ');
  });
});
