import { httpClient } from '@/api/http-client';
import {
  parseCreateInvoiceResponse,
  parseInvoiceDetailResponse,
  parseInvoiceListResponse,
  parseInvoiceSummaryResponse,
} from '@/api/invoices.schema';
import type {
  CreateInvoiceRequest,
  InvoiceDetail,
  InvoiceListQuery,
  InvoiceListResponse,
  InvoiceSummary,
} from '@/api/types';

function buildInvoiceQueryParams(query: InvoiceListQuery) {
  return {
    page: query.page,
    pageSize: query.pageSize,
    keyword: query.keyword || undefined,
    status: query.status || undefined,
    sortBy: query.sortBy || undefined,
    ordering: query.ordering || undefined,
    fromDate: query.fromDate || undefined,
    toDate: query.toDate || undefined,
  };
}

export async function getInvoices(
  query: InvoiceListQuery,
): Promise<InvoiceListResponse> {
  const response = await httpClient.get('/invoices', {
    params: buildInvoiceQueryParams(query),
  });

  return parseInvoiceListResponse(response.data);
}

export async function getInvoiceSummary(
  query: InvoiceListQuery,
): Promise<InvoiceSummary> {
  const response = await httpClient.get('/invoices/summary', {
    params: buildInvoiceQueryParams(query),
  });

  return parseInvoiceSummaryResponse(response.data);
}

export async function getInvoiceById(id: string): Promise<InvoiceDetail> {
  const response = await httpClient.get(`/invoices/${id}`);

  return parseInvoiceDetailResponse(response.data);
}

export async function createInvoice(
  payload: CreateInvoiceRequest,
): Promise<InvoiceDetail> {
  const response = await httpClient.post('/invoices', payload);

  return parseCreateInvoiceResponse(response.data);
}
