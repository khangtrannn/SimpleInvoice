const CURRENCY_SYMBOLS: Record<string, string> = {
  AUD: 'AU$',
  USD: 'US$',
  GBP: '£',
};

export const SUPPORTED_CURRENCIES = Object.freeze(
  Object.keys(CURRENCY_SYMBOLS),
);

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}
