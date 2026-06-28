export function formatPreviewMoney(amount: number, currencySymbol: string) {
  return `${currencySymbol}${new Intl.NumberFormat('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function formatPreviewDate(dateValue: string) {
  if (!dateValue) {
    return '-';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateValue}T00:00:00`));
}
