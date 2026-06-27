import { QueryFailedError } from 'typeorm';

import { InvoicesRepository } from './invoices.repository';

describe(InvoicesRepository.name, () => {
  let invoicesRepository: InvoicesRepository;

  beforeEach(() => {
    invoicesRepository = new InvoicesRepository({} as never, {} as never);
  });

  describe('isUniqueViolation', () => {
    it('should return true for Postgres unique violation error', () => {
      // Arrange
      const driverError = Object.assign(new Error('duplicate key'), {
        code: '23505',
      });
      const error = new QueryFailedError('INSERT', [], driverError);

      // Act
      const result = invoicesRepository.isUniqueViolation(error);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for non-unique errors', () => {
      // Arrange
      const error = new Error('Something else failed');

      // Act
      const result = invoicesRepository.isUniqueViolation(error);

      // Assert
      expect(result).toBe(false);
    });
  });
});
