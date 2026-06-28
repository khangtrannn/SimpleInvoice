import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getInvoices, getInvoiceSummary } from '@/api/invoices.api';
import type { InvoiceListQuery } from '@/api/types';

export const invoiceQueryKeys = {
  all: ['invoices'] as const,
  list: (query: InvoiceListQuery) =>
    [...invoiceQueryKeys.all, 'list', query] as const,
  summary: (query: InvoiceListQuery) =>
    [...invoiceQueryKeys.all, 'summary', query] as const,
};

export function useInvoices(query: InvoiceListQuery) {
  return useQuery({
    queryKey: invoiceQueryKeys.list(query),
    queryFn: () => getInvoices(query),
    placeholderData: keepPreviousData,
  });
}

export function useInvoiceSummary(query: InvoiceListQuery) {
  return useQuery({
    queryKey: invoiceQueryKeys.summary(query),
    queryFn: () => getInvoiceSummary(query),
    placeholderData: keepPreviousData,
  });
}
