import { QueryClient } from '@tanstack/react-query';
import type { DefaultOptions } from '@tanstack/react-query';

export const appQueryClientDefaultOptions: DefaultOptions = {
  queries: {
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  },
};

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: appQueryClientDefaultOptions,
  });
}
