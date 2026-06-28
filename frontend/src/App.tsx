import { RouterProvider } from 'react-router';

import { AppErrorBoundary } from '@/app/AppErrorBoundary';
import { AppProviders } from '@/app/providers';
import { router } from '@/app/router';

export function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </AppErrorBoundary>
  );
}