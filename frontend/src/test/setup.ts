import '@testing-library/jest-dom/vitest';

import { configure, cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

configure({ defaultIgnore: 'script, style, [aria-hidden="true"], [aria-hidden="true"] *' });

import { server } from '@/test/mocks/server';

function createMemoryStorage(): Storage {
  const storage = new Map<string, string>();

  return {
    get length() {
      return storage.size;
    },
    clear() {
      storage.clear();
    },
    getItem(key: string) {
      return storage.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(storage.keys())[index] ?? null;
    },
    removeItem(key: string) {
      storage.delete(key);
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
  };
}

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: createMemoryStorage(),
});

Object.defineProperty(window, 'sessionStorage', {
  configurable: true,
  value: createMemoryStorage(),
});

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
