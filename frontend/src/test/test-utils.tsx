import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router';
import type { RouteObject } from 'react-router';

import { AuthProvider } from '@/features/auth/auth-context';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

type RenderWithRouterOptions = {
  routes: RouteObject[];
  initialEntries?: string[];
};

export function renderWithRouter({
  routes,
  initialEntries = ['/'],
}: RenderWithRouterOptions): RenderResult {
  const queryClient = createTestQueryClient();

  const router = createMemoryRouter(routes, {
    initialEntries,
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

export function renderWithProviders(ui: ReactElement): RenderResult {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{ui}</AuthProvider>
    </QueryClientProvider>,
  );
}
