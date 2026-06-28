import { describe, expect, it } from 'vitest';

import { formatLineAmount, formatMoney } from './money';

describe('formatMoney', () => {
  it('formats money with currency symbol and currency code', () => {
    const amount = '1250';

    const result = formatMoney(amount, 'AUD', 'AU$');

    expect(result).toBe('AU$1,250.00 AUD');
  });

  it('formats numeric amount', () => {
    const amount = 99.5;

    const result = formatMoney(amount, 'USD', 'US$');

    expect(result).toBe('US$99.50 USD');
  });

  it('falls back to raw amount when amount is not numeric', () => {
    const amount = 'not-a-number';

    const result = formatMoney(amount, 'AUD', 'AU$');

    expect(result).toBe('not-a-number AUD');
  });
});

describe('formatLineAmount', () => {
  it('formats line amount with currency symbol', () => {
    const amount = '1250';

    const result = formatLineAmount(amount, 'AU$');

    expect(result).toBe('AU$1,250.00');
  });

  it('formats zero amount', () => {
    const amount = 0;

    const result = formatLineAmount(amount, 'AU$');

    expect(result).toBe('AU$0.00');
  });

  it('falls back to raw amount when amount is not numeric', () => {
    const amount = 'invalid';

    const result = formatLineAmount(amount, 'AU$');

    expect(result).toBe('AU$invalid');
  });
});
