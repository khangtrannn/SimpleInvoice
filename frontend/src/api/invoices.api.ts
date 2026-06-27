import { httpClient } from '@/api/http-client';
import type { InvoiceDetail, InvoiceListQuery, InvoiceListResponse } from '@/api/types';

export async function getInvoices(query: InvoiceListQuery) {
  const response = await httpClient.get<InvoiceListResponse>('/invoices', {
    params: {
      page: query.page,
      pageSize: query.pageSize,
      keyword: query.keyword || undefined,
      status: query.status || undefined,
      sortBy: query.sortBy || undefined,
      ordering: query.ordering || undefined,
      fromDate: query.fromDate || undefined,
      toDate: query.toDate || undefined,
    },
  });

  return response.data;
}

export async function getInvoiceById(id: string) {
  const response = await httpClient.get<InvoiceDetail>(`/invoices/${id}`);

  return response.data;
}
