import { useQuery } from '@tanstack/react-query';

import { getInvoiceById } from '@/api/invoices.api';

export const invoiceDetailQueryKeys = {
  detail: (invoiceId: string) => ['invoices', 'detail', invoiceId] as const,
};

export function useInvoiceDetail(invoiceId: string | undefined) {
  return useQuery({
    queryKey: invoiceDetailQueryKeys.detail(invoiceId ?? ''),
    queryFn: () => getInvoiceById(invoiceId!),
    enabled: Boolean(invoiceId),
  });
}
