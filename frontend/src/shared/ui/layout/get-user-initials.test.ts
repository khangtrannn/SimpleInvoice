import { describe, expect, it } from 'vitest';

import { getUserInitials } from './get-user-initials';

describe('getUserInitials', () => {
  it('returns initials from full name', () => {
    expect(getUserInitials('Khang Tran')).toBe('KT');
  });

  it('handles extra spaces', () => {
    expect(getUserInitials('  Khang   Tran  ')).toBe('KT');
  });

  it('uses first two name parts only', () => {
    expect(getUserInitials('Khang Van Tran')).toBe('KV');
  });

  it('returns fallback for missing name', () => {
    expect(getUserInitials('')).toBe('?');
    expect(getUserInitials(null)).toBe('?');
    expect(getUserInitials(undefined)).toBe('?');
  });
});
