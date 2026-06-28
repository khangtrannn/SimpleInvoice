import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Toaster } from 'sonner';

import { createAppQueryClient } from '@/app/query-client';
import { AuthProvider } from '@/features/auth/auth-context';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createAppQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}
