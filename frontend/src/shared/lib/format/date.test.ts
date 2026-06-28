import { describe, expect, it } from 'vitest';

import { formatDate, formatDateTime, getDaysOverdue } from './date';

describe('formatDate', () => {
  it('formats a date-only value', () => {
    const dateValue = '2026-06-28';

    const result = formatDate(dateValue);

    expect(result).toBe('Jun 28, 2026');
  });
});

describe('formatDateTime', () => {
  it('formats an ISO datetime value', () => {
    const dateValue = '2026-06-28T10:30:00.000Z';

    const result = formatDateTime(dateValue);

    expect(result).toContain('Jun 28, 2026');
  });
});

describe('getDaysOverdue', () => {
  it('returns overdue days when due date is in the past', () => {
    const today = new Date('2026-06-28T00:00:00.000Z');

    const result = getDaysOverdue('2026-06-25', today);

    expect(result).toBe(3);
  });

  it('returns 0 when due date is today', () => {
    const today = new Date('2026-06-28T00:00:00.000Z');

    const result = getDaysOverdue('2026-06-28', today);

    expect(result).toBe(0);
  });

  it('returns 0 when due date is in the future', () => {
    const today = new Date('2026-06-28T00:00:00.000Z');

    const result = getDaysOverdue('2026-07-01', today);

    expect(result).toBe(0);
  });
});
