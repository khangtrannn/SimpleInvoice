import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createInvoice } from '@/api/invoices.api';
import { invoiceQueryKeys } from '@/features/invoices/hooks/use-invoices';

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInvoice,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: invoiceQueryKeys.all,
      });
    },
  });
}
