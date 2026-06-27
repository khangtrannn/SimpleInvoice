import { QueryFailedError } from 'typeorm';

const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';

export function isUniqueViolation(
  error: unknown,
  constraint?: string,
): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = error.driverError as {
    code?: string;
    constraint?: string;
  };

  if (driverError.code !== POSTGRES_UNIQUE_VIOLATION_CODE) {
    return false;
  }

  return constraint === undefined || driverError.constraint === constraint;
}
