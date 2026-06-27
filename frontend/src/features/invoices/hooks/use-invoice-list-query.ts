import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { InvoiceListQuery, InvoiceSortBy, InvoiceStatus, Ordering } from '@/api/types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_BY: InvoiceSortBy = 'invoiceDate';
const DEFAULT_ORDERING: Ordering = 'DESC';

const invoiceStatuses: InvoiceStatus[] = ['Draft', 'Pending', 'Paid', 'Overdue'];
const sortFields: InvoiceSortBy[] = ['invoiceDate', 'dueDate', 'totalAmount'];
const orderings: Ordering[] = ['ASC', 'DESC'];

function parsePositiveNumber(value: string | null, fallback: number) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

function parseStatus(value: string | null) {
  if (!value) {
    return undefined;
  }

  return invoiceStatuses.includes(value as InvoiceStatus) ? (value as InvoiceStatus) : undefined;
}

function parseSortBy(value: string | null) {
  if (!value) {
    return DEFAULT_SORT_BY;
  }

  return sortFields.includes(value as InvoiceSortBy) ? (value as InvoiceSortBy) : DEFAULT_SORT_BY;
}

function parseOrdering(value: string | null) {
  if (!value) {
    return DEFAULT_ORDERING;
  }

  return orderings.includes(value as Ordering) ? (value as Ordering) : DEFAULT_ORDERING;
}

export function useInvoiceListQuery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo<InvoiceListQuery>(() => {
    return {
      page: parsePositiveNumber(searchParams.get('page'), DEFAULT_PAGE),
      pageSize: parsePositiveNumber(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE),
      keyword: searchParams.get('keyword') || undefined,
      status: parseStatus(searchParams.get('status')),
      sortBy: parseSortBy(searchParams.get('sortBy')),
      ordering: parseOrdering(searchParams.get('ordering')),
      fromDate: searchParams.get('fromDate') || undefined,
      toDate: searchParams.get('toDate') || undefined,
    };
  }, [searchParams]);

  function updateQuery(nextQuery: Partial<InvoiceListQuery>) {
    const mergedQuery: InvoiceListQuery = {
      ...query,
      ...nextQuery,
    };

    const nextParams = new URLSearchParams();

    nextParams.set('page', String(mergedQuery.page));
    nextParams.set('pageSize', String(mergedQuery.pageSize));

    if (mergedQuery.keyword) {
      nextParams.set('keyword', mergedQuery.keyword);
    }

    if (mergedQuery.status) {
      nextParams.set('status', mergedQuery.status);
    }

    if (mergedQuery.sortBy) {
      nextParams.set('sortBy', mergedQuery.sortBy);
    }

    if (mergedQuery.ordering) {
      nextParams.set('ordering', mergedQuery.ordering);
    }

    if (mergedQuery.fromDate) {
      nextParams.set('fromDate', mergedQuery.fromDate);
    }

    if (mergedQuery.toDate) {
      nextParams.set('toDate', mergedQuery.toDate);
    }

    setSearchParams(nextParams);
  }

  function resetQuery() {
    setSearchParams({
      page: String(DEFAULT_PAGE),
      pageSize: String(DEFAULT_PAGE_SIZE),
      sortBy: DEFAULT_SORT_BY,
      ordering: DEFAULT_ORDERING,
    });
  }

  return {
    query,
    updateQuery,
    resetQuery,
  };
}
