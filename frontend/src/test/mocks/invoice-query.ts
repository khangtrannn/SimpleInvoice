import type {
  InvoiceListItem,
  InvoiceListResponse,
  InvoiceSortBy,
  InvoiceStatus,
  InvoiceSummary,
  Ordering,
} from '@/api/types';

type InvoiceQueryParams = {
  keyword?: string;
  status?: InvoiceStatus;
  sortBy: InvoiceSortBy;
  ordering: Ordering;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
};

export function parseInvoiceRequestUrl(url: URL): InvoiceQueryParams {
  return {
    keyword: url.searchParams.get('keyword')?.toLowerCase().trim() || undefined,
    status: parseInvoiceStatus(url.searchParams.get('status')),
    sortBy: parseSortBy(url.searchParams.get('sortBy')),
    ordering: parseOrdering(url.searchParams.get('ordering')),
    fromDate: url.searchParams.get('fromDate') || undefined,
    toDate: url.searchParams.get('toDate') || undefined,
    page: parsePositiveInteger(url.searchParams.get('page'), 1),
    pageSize: parsePositiveInteger(url.searchParams.get('pageSize'), 10),
  };
}

export function buildInvoiceListResponse(
  invoices: InvoiceListItem[],
  query: InvoiceQueryParams,
): InvoiceListResponse {
  const filteredInvoices = filterInvoices(invoices, query);
  const sortedInvoices = sortInvoices(
    filteredInvoices,
    query.sortBy,
    query.ordering,
  );
  const pagedInvoices = paginateInvoices(
    sortedInvoices,
    query.page,
    query.pageSize,
  );

  return {
    data: pagedInvoices,
    paging: {
      page: query.page,
      pageSize: query.pageSize,
      total: filteredInvoices.length,
    },
  };
}

export function filterInvoices(
  invoices: InvoiceListItem[],
  query: Pick<InvoiceQueryParams, 'keyword' | 'status' | 'fromDate' | 'toDate'>,
): InvoiceListItem[] {
  return invoices.filter((invoice) => {
    const matchesKeyword = query.keyword
      ? invoice.invoiceNumber.toLowerCase().includes(query.keyword) ||
        invoice.customerName.toLowerCase().includes(query.keyword)
      : true;

    const matchesStatus = query.status ? invoice.status === query.status : true;

    const matchesFromDate = query.fromDate
      ? invoice.invoiceDate >= query.fromDate
      : true;

    const matchesToDate = query.toDate
      ? invoice.invoiceDate <= query.toDate
      : true;

    return matchesKeyword && matchesStatus && matchesFromDate && matchesToDate;
  });
}

export function sortInvoices(
  invoices: InvoiceListItem[],
  sortBy: InvoiceSortBy,
  ordering: Ordering,
): InvoiceListItem[] {
  return [...invoices].sort((firstInvoice, secondInvoice) => {
    const firstValue = getSortValue(firstInvoice, sortBy);
    const secondValue = getSortValue(secondInvoice, sortBy);

    if (firstValue < secondValue) {
      return ordering === 'ASC' ? -1 : 1;
    }

    if (firstValue > secondValue) {
      return ordering === 'ASC' ? 1 : -1;
    }

    return 0;
  });
}

export function paginateInvoices(
  invoices: InvoiceListItem[],
  page: number,
  pageSize: number,
): InvoiceListItem[] {
  const startIndex = (page - 1) * pageSize;

  return invoices.slice(startIndex, startIndex + pageSize);
}

export function buildInvoiceSummary(
  invoices: InvoiceListItem[],
): InvoiceSummary {
  const today = new Date().toISOString().slice(0, 10);

  const paidInvoices = invoices.filter((invoice) => invoice.status === 'Paid');
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === 'Pending' && invoice.dueDate >= today,
  );
  const overdueInvoices = invoices.filter(
    (invoice) => invoice.status !== 'Paid' && invoice.dueDate < today,
  );
  const draftInvoices = invoices.filter((invoice) => invoice.status === 'Draft');

  const currencies = [...new Set(invoices.map((invoice) => invoice.currency))];

  return {
    totalRevenue: sumInvoiceAmounts(invoices),
    totalPaid: sumInvoiceAmounts(paidInvoices),
    totalPending: sumInvoiceAmounts(pendingInvoices),
    totalOverdue: sumInvoiceAmounts(overdueInvoices),
    totalDraft: sumInvoiceAmounts(draftInvoices),
    paidCount: paidInvoices.length,
    pendingCount: pendingInvoices.length,
    overdueCount: overdueInvoices.length,
    draftCount: draftInvoices.length,
    currency: currencies[0] ?? null,
    currencySymbol: invoices[0]?.currencySymbol ?? null,
    currencyCount: currencies.length,
  };
}

function getSortValue(invoice: InvoiceListItem, sortBy: InvoiceSortBy): string | number {
  if (sortBy === 'totalAmount') {
    return Number(invoice.totalAmount);
  }

  if (sortBy === 'invoiceDate') {
    return invoice.invoiceDate;
  }

  if (sortBy === 'dueDate') {
    return invoice.dueDate || '';
  }

  return invoice.invoiceDate;
}

function sumInvoiceAmounts(invoices: InvoiceListItem[]): string {
  return invoices
    .reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0)
    .toFixed(2);
}

function parseInvoiceStatus(value: string | null): InvoiceStatus | undefined {
  if (
    value === 'Draft' ||
    value === 'Pending' ||
    value === 'Paid' ||
    value === 'Overdue'
  ) {
    return value;
  }

  return undefined;
}

function parseSortBy(value: string | null): InvoiceSortBy {
  if (
    value === 'createdAt' ||
    value === 'invoiceDate' ||
    value === 'dueDate' ||
    value === 'totalAmount'
  ) {
    return value;
  }

  return 'createdAt';
}

function parseOrdering(value: string | null): Ordering {
  return value === 'ASC' || value === 'DESC' ? value : 'DESC';
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}
