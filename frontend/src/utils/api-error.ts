import axios from 'axios';

import { ApiResponseValidationError } from '@/api/parse-api-response';
import type { ApiErrorResponse } from '@/api/types';

export function getApiErrorMessage(error: unknown, fallbackMessage = 'Something went wrong.') {
  if (error instanceof ApiResponseValidationError) {
    return 'We received an unexpected response from the server. Please try again or contact support if this continues.';
  }

  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join('\n');
  }

  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }

  return fallbackMessage;
}