import { z } from 'zod';

import type { InvoiceListQuery, InvoiceSortBy, InvoiceStatus, Ordering } from '@/api/types';

export const DEFAULT_INVOICE_LIST_PAGE = 1;
export const DEFAULT_INVOICE_LIST_PAGE_SIZE = 10;
export const DEFAULT_INVOICE_LIST_SORT_BY: InvoiceSortBy = 'createdAt';
export const DEFAULT_INVOICE_LIST_ORDERING: Ordering = 'DESC';

const invoiceStatuses = ['Draft', 'Pending', 'Paid', 'Overdue'] as const;
const invoiceSortFields = ['createdAt', 'invoiceDate', 'dueDate', 'totalAmount'] as const;
const invoiceOrderings = ['ASC', 'DESC'] as const;
const invoicePageSizes = [10, 20, 50] as const;

const invoiceStatusSchema = z.enum(invoiceStatuses).optional();
const invoiceSortBySchema = z.enum(invoiceSortFields).catch(DEFAULT_INVOICE_LIST_SORT_BY);
const invoiceOrderingSchema = z.enum(invoiceOrderings).catch(DEFAULT_INVOICE_LIST_ORDERING);

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

function parsePageSize(value: string | null): number {
  const parsedValue = parsePositiveInteger(value, DEFAULT_INVOICE_LIST_PAGE_SIZE);

  return invoicePageSizes.includes(parsedValue as (typeof invoicePageSizes)[number])
    ? parsedValue
    : DEFAULT_INVOICE_LIST_PAGE_SIZE;
}

function parseKeyword(value: string | null): string | undefined {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function parseStatus(value: string | null): InvoiceStatus | undefined {
  const result = invoiceStatusSchema.safeParse(value);

  return result.success ? result.data : undefined;
}

function parseSortBy(value: string | null): InvoiceSortBy {
  return invoiceSortBySchema.parse(value ?? DEFAULT_INVOICE_LIST_SORT_BY);
}

function parseOrdering(value: string | null): Ordering {
  return invoiceOrderingSchema.parse(value ?? DEFAULT_INVOICE_LIST_ORDERING);
}

function isValidDateValue(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString().slice(0, 10) === value;
}

function parseDate(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  return isValidDateValue(value) ? value : undefined;
}

function normalizeDateRange(
  fromDate: string | undefined,
  toDate: string | undefined,
): Pick<InvoiceListQuery, 'fromDate' | 'toDate'> {
  if (!fromDate || !toDate) {
    return {
      fromDate,
      toDate,
    };
  }

  if (fromDate <= toDate) {
    return {
      fromDate,
      toDate,
    };
  }

  return {
    fromDate: toDate,
    toDate: fromDate,
  };
}

export function parseInvoiceListSearchParams(searchParams: URLSearchParams): InvoiceListQuery {
  const dateRange = normalizeDateRange(
    parseDate(searchParams.get('fromDate')),
    parseDate(searchParams.get('toDate')),
  );

  return {
    page: parsePositiveInteger(searchParams.get('page'), DEFAULT_INVOICE_LIST_PAGE),
    pageSize: parsePageSize(searchParams.get('pageSize')),
    keyword: parseKeyword(searchParams.get('keyword')),
    status: parseStatus(searchParams.get('status')),
    sortBy: parseSortBy(searchParams.get('sortBy')),
    ordering: parseOrdering(searchParams.get('ordering')),
    ...dateRange,
  };
}

export function normalizeInvoiceListQuery(query: Partial<InvoiceListQuery>): InvoiceListQuery {
  const searchParams = serializeInvoiceListQuery({
    page: query.page ?? DEFAULT_INVOICE_LIST_PAGE,
    pageSize: query.pageSize ?? DEFAULT_INVOICE_LIST_PAGE_SIZE,
    keyword: query.keyword,
    status: query.status,
    sortBy: query.sortBy ?? DEFAULT_INVOICE_LIST_SORT_BY,
    ordering: query.ordering ?? DEFAULT_INVOICE_LIST_ORDERING,
    fromDate: query.fromDate,
    toDate: query.toDate,
  });

  return parseInvoiceListSearchParams(searchParams);
}

export function serializeInvoiceListQuery(query: InvoiceListQuery): URLSearchParams {
  const normalizedQuery = {
    ...query,
    keyword: parseKeyword(query.keyword ?? null),
    status: parseStatus(query.status ?? null),
    sortBy: parseSortBy(query.sortBy ?? null),
    ordering: parseOrdering(query.ordering ?? null),
    page: parsePositiveInteger(String(query.page), DEFAULT_INVOICE_LIST_PAGE),
    pageSize: parsePageSize(String(query.pageSize)),
    ...normalizeDateRange(parseDate(query.fromDate ?? null), parseDate(query.toDate ?? null)),
  };

  const nextParams = new URLSearchParams();

  nextParams.set('page', String(normalizedQuery.page));
  nextParams.set('pageSize', String(normalizedQuery.pageSize));
  nextParams.set('sortBy', normalizedQuery.sortBy);
  nextParams.set('ordering', normalizedQuery.ordering);

  if (normalizedQuery.keyword) {
    nextParams.set('keyword', normalizedQuery.keyword);
  }

  if (normalizedQuery.status) {
    nextParams.set('status', normalizedQuery.status);
  }

  if (normalizedQuery.fromDate) {
    nextParams.set('fromDate', normalizedQuery.fromDate);
  }

  if (normalizedQuery.toDate) {
    nextParams.set('toDate', normalizedQuery.toDate);
  }

  return nextParams;
}
