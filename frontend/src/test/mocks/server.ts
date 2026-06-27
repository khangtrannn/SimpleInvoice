import { setupServer } from 'msw/node';

import { authHandlers } from '@/test/mocks/auth-handlers';

export const server = setupServer(...authHandlers);
