import { setupServer } from 'msw/node';

import { authHandlers } from '@/test/mocks/auth-handlers';
import { invoiceHandlers } from '@/test/mocks/invoice-handlers';

export const server = setupServer(...authHandlers, ...invoiceHandlers);
