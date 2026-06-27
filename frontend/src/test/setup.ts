import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from '@/test/mocks/server';

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();

  window.localStorage.clear();
  window.sessionStorage.clear();

  vi.clearAllMocks();
  vi.restoreAllMocks();
});

afterAll(() => {
  server.close();
});
