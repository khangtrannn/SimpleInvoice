export function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateValue}T00:00:00`));
}

export function formatDateTime(dateValue: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue));
}

export function formatMoney(amount: string | number, currency: string, currencySymbol?: string) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${amount} ${currency}`;
  }

  const formattedAmount = new Intl.NumberFormat('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);

  return `${currencySymbol ?? ''}${formattedAmount} ${currency}`;
}

export function formatLineAmount(amount: string | number, currencySymbol?: string) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${currencySymbol ?? ''}${amount}`;
  }

  return `${currencySymbol ?? ''}${new Intl.NumberFormat('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount)}`;
}

export function getDaysOverdue(dueDate: string) {
  const today = new Date();
  const due = new Date(`${dueDate}T00:00:00`);

  today.setHours(0, 0, 0, 0);

  const diffInMs = today.getTime() - due.getTime();

  if (diffInMs <= 0) {
    return 0;
  }

  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}
