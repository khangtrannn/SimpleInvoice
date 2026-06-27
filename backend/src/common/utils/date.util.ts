export function getTodayDateOnly(): string {
  // Uses the UTC calendar date so derived Overdue status is stable across environments.
  return new Date().toISOString().slice(0, 10);
}
