import type { CurrencyCode } from '@/api/types';

export type CurrencyOption = {
  code: CurrencyCode;
  label: string;
  symbol: string;
};

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    code: 'AUD',
    label: 'AUD - Australian Dollar',
    symbol: 'AU$',
  },
  {
    code: 'USD',
    label: 'USD - US Dollar',
    symbol: 'US$',
  },
  {
    code: 'GBP',
    label: 'GBP - British Pound',
    symbol: '£',
  },
];

export const DEFAULT_CURRENCY: CurrencyCode = 'AUD';

export function getCurrencyOption(currencyCode: CurrencyCode): CurrencyOption {
  return (
    CURRENCY_OPTIONS.find((currency) => currency.code === currencyCode) ??
    CURRENCY_OPTIONS[0]
  );
}

export function getCurrencyLabel(currencyCode: string): string {
  const option = CURRENCY_OPTIONS.find((currency) => currency.code === currencyCode);

  return option?.label ?? currencyCode;
}
