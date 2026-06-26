export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function daysFromToday(days: number): string {
  const date = new Date();

  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);

  return formatDate(date);
}