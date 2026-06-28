import { z } from 'zod';

import type {
  InvoiceCustomer,
  InvoiceDetail,
  InvoiceItem,
  InvoiceListItem,
  InvoiceListResponse,
  InvoiceStatus,
  InvoiceSummary,
  Paging,
} from '@/api/types';
import { parseApiResponse } from '@/api/parse-api-response';

const invoiceStatusSchema: z.ZodType<InvoiceStatus> = z.enum([
  'Draft',
  'Pending',
  'Paid',
  'Overdue',
]);

const numericStringSchema = z.string().refine(
  (value) => value.trim() !== '' && Number.isFinite(Number(value)),
  {
    message: 'Expected numeric string',
  },
);

const nullableStringSchema = z.string().nullable();

const pagingSchema: z.ZodType<Paging> = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

export const invoiceListItemSchema: z.ZodType<InvoiceListItem> = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  customerName: z.string(),
  invoiceDate: z.string(),
  dueDate: z.string(),
  currency: z.string(),
  currencySymbol: z.string(),
  totalAmount: numericStringSchema,
  status: invoiceStatusSchema,
});

export const invoiceSummarySchema: z.ZodType<InvoiceSummary> = z.object({
  totalRevenue: numericStringSchema,
  totalPaid: numericStringSchema,
  totalPending: numericStringSchema,
  totalOverdue: numericStringSchema,
  totalDraft: numericStringSchema,
  paidCount: z.number().int().nonnegative(),
  pendingCount: z.number().int().nonnegative(),
  overdueCount: z.number().int().nonnegative(),
  draftCount: z.number().int().nonnegative(),
  currency: nullableStringSchema,
  currencySymbol: nullableStringSchema,
  currencyCount: z.number().int().nonnegative(),
});

export const invoiceListResponseSchema: z.ZodType<InvoiceListResponse> =
  z.object({
    data: z.array(invoiceListItemSchema),
    paging: pagingSchema,
  });

const invoiceCustomerSchema: z.ZodType<InvoiceCustomer> = z.object({
  fullname: z.string(),
  email: z.string(),
  mobileNumber: nullableStringSchema,
  address: nullableStringSchema,
});

const invoiceItemSchema: z.ZodType<InvoiceItem> = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  rate: numericStringSchema,
});

export const invoiceDetailSchema: z.ZodType<InvoiceDetail> = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  invoiceReference: nullableStringSchema,
  invoiceDate: z.string(),
  dueDate: z.string(),
  currency: z.string(),
  currencySymbol: z.string(),
  description: nullableStringSchema,
  status: invoiceStatusSchema,
  customer: invoiceCustomerSchema,
  items: z.array(invoiceItemSchema),
  invoiceSubTotal: numericStringSchema,
  taxPercentage: numericStringSchema,
  totalTax: numericStringSchema,
  totalDiscount: numericStringSchema,
  totalAmount: numericStringSchema,
  totalPaid: numericStringSchema,
  balanceAmount: numericStringSchema,
  createdAt: z.string(),
});

export function parseInvoiceListResponse(data: unknown): InvoiceListResponse {
  return parseApiResponse(invoiceListResponseSchema, data, 'GET /invoices');
}

export function parseInvoiceSummaryResponse(data: unknown): InvoiceSummary {
  return parseApiResponse(
    invoiceSummarySchema,
    data,
    'GET /invoices/summary',
  );
}

export function parseInvoiceDetailResponse(
  data: unknown,
  endpoint = 'GET /invoices/:id',
): InvoiceDetail {
  return parseApiResponse(invoiceDetailSchema, data, endpoint);
}

export function parseCreateInvoiceResponse(data: unknown): InvoiceDetail {
  return parseInvoiceDetailResponse(data, 'POST /invoices');
}
