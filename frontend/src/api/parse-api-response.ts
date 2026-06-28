import type { ZodIssue, ZodType } from 'zod';

export class ApiResponseValidationError extends Error {
  readonly endpoint: string;
  readonly issues: ZodIssue[];

  constructor(endpoint: string, issues: ZodIssue[]) {
    super(`Invalid API response from ${endpoint}`);

    this.name = 'ApiResponseValidationError';
    this.endpoint = endpoint;
    this.issues = issues;
  }
}

export function parseApiResponse<T>(
  schema: ZodType<T>,
  data: unknown,
  endpoint: string,
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error(
      `Invalid API response from ${endpoint}:`,
      result.error.issues,
    );

    throw new ApiResponseValidationError(endpoint, result.error.issues);
  }

  return result.data;
}
