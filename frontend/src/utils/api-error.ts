import axios from 'axios';

import type { ApiErrorResponse } from '@/api/types';

export function getApiErrorMessage(error: unknown, fallbackMessage = 'Something went wrong.') {
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