import axios from 'axios';

import { ApiResponseValidationError } from '@/api/parse-api-response';
import type { ApiErrorResponse } from '@/api/types';

const NETWORK_ERROR_MESSAGE =
  'Unable to reach the server. Please check your connection and try again.';
const SERVER_ERROR_MESSAGE =
  'The server is having trouble right now. Please try again shortly.';

export function getApiErrorMessage(error: unknown, fallbackMessage = 'Something went wrong.') {
  if (error instanceof ApiResponseValidationError) {
    return 'We received an unexpected response from the server. Please try again or contact support if this continues.';
  }

  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  if (!error.response) {
    return NETWORK_ERROR_MESSAGE;
  }

  if (error.response.status >= 500) {
    return SERVER_ERROR_MESSAGE;
  }

  const message = error.response.data?.message;

  if (Array.isArray(message)) {
    return message.join('\n');
  }

  if (typeof message === 'string' && message.trim().length > 0) {
    return message;
  }

  return fallbackMessage;
}
