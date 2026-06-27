import '@testing-library/jest-dom/vitest';

import { configure, cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

configure({ defaultIgnore: 'script, style, [aria-hidden="true"], [aria-hidden="true"] *' });

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
