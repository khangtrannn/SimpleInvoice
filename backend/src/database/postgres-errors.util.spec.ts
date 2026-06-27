import { QueryFailedError } from 'typeorm';

import { isUniqueViolation } from './postgres-errors.util';

describe(isUniqueViolation.name, () => {
  it('should return true for a Postgres unique violation error', () => {
    const driverError = Object.assign(new Error('duplicate key'), {
      code: '23505',
    });
    const error = new QueryFailedError('INSERT', [], driverError);

    expect(isUniqueViolation(error)).toBe(true);
  });

  it('should return true when the constraint name also matches', () => {
    const driverError = Object.assign(new Error('duplicate key'), {
      code: '23505',
      constraint: 'UQ_invoices_invoice_number',
    });
    const error = new QueryFailedError('INSERT', [], driverError);

    expect(isUniqueViolation(error, 'UQ_invoices_invoice_number')).toBe(true);
  });

  it('should return false when the constraint name does not match', () => {
    const driverError = Object.assign(new Error('duplicate key'), {
      code: '23505',
      constraint: 'UQ_other_constraint',
    });
    const error = new QueryFailedError('INSERT', [], driverError);

    expect(isUniqueViolation(error, 'UQ_invoices_invoice_number')).toBe(false);
  });

  it('should return false for non-unique errors', () => {
    expect(isUniqueViolation(new Error('Something else failed'))).toBe(false);
  });
});
