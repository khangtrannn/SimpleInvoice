const MONEY_FORMATTER = new Intl.NumberFormat('en', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(
  amount: string | number,
  currency: string,
  currencySymbol?: string,
) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${amount} ${currency}`;
  }

  return `${currencySymbol ?? ''}${MONEY_FORMATTER.format(
    numericAmount,
  )} ${currency}`;
}

export function formatLineAmount(amount: string | number, currencySymbol?: string) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${currencySymbol ?? ''}${amount}`;
  }

  return `${currencySymbol ?? ''}${MONEY_FORMATTER.format(numericAmount)}`;
}
