const DATE_FORMATTER = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function formatDate(dateValue: string) {
  return DATE_FORMATTER.format(new Date(`${dateValue}T00:00:00`));
}

export function formatDateTime(dateValue: string) {
  return DATE_TIME_FORMATTER.format(new Date(dateValue));
}

export function getDaysOverdue(dueDate: string, today = new Date()) {
  const normalizedToday = new Date(today);
  const due = new Date(`${dueDate}T00:00:00`);

  normalizedToday.setHours(0, 0, 0, 0);

  const diffInMs = normalizedToday.getTime() - due.getTime();

  if (diffInMs <= 0) {
    return 0;
  }

  return Math.floor(diffInMs / MS_PER_DAY);
}
