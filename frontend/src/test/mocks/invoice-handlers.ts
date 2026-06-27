import { http, HttpResponse } from 'msw';

import type {
  InvoiceListItem,
  InvoiceListResponse,
  InvoiceSortBy,
  InvoiceStatus,
  Ordering,
} from '@/api/types';
import { API_BASE_URL } from '@/test/mocks/auth-handlers';

export const mockInvoices: InvoiceListItem[] = [
  {
    id: 'invoice-1',
    invoiceNumber: 'INV-2026-001',
    customerName: 'Acme Corporation',
    invoiceDate: '2026-05-12',
    dueDate: '2026-05-26',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '2450.00',
    status: 'Paid',
  },
  {
    id: 'invoice-2',
    invoiceNumber: 'INV-2026-002',
    customerName: 'Bright Ideas Pty Ltd',
    invoiceDate: '2026-05-10',
    dueDate: '2026-05-24',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '1850.00',
    status: 'Pending',
  },
  {
    id: 'invoice-3',
    invoiceNumber: 'INV-2026-003',
    customerName: 'Creative Studio',
    invoiceDate: '2026-05-08',
    dueDate: '2026-05-22',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '3200.00',
    status: 'Overdue',
  },
  {
    id: 'invoice-4',
    invoiceNumber: 'INV-2026-004',
    customerName: 'Delta Solutions',
    invoiceDate: '2026-05-05',
    dueDate: '2026-05-19',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '950.00',
    status: 'Draft',
  },
  {
    id: 'invoice-5',
    invoiceNumber: 'INV-2026-005',
    customerName: 'Echo Enterprises',
    invoiceDate: '2026-05-03',
    dueDate: '2026-05-17',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '5600.00',
    status: 'Paid',
  },
  {
    id: 'invoice-6',
    invoiceNumber: 'INV-2026-006',
    customerName: 'Future Tech',
    invoiceDate: '2026-04-30',
    dueDate: '2026-05-14',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '4120.00',
    status: 'Pending',
  },
  {
    id: 'invoice-7',
    invoiceNumber: 'INV-2026-007',
    customerName: 'Greenfield Ltd',
    invoiceDate: '2026-04-28',
    dueDate: '2026-05-12',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '1270.00',
    status: 'Overdue',
  },
  {
    id: 'invoice-8',
    invoiceNumber: 'INV-2026-008',
    customerName: 'Horizon Marketing',
    invoiceDate: '2026-04-25',
    dueDate: '2026-05-09',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '750.00',
    status: 'Draft',
  },
];

function isInvoiceStatus(value: string | null): value is InvoiceStatus {
  return value === 'Draft' || value === 'Pending' || value === 'Paid' || value === 'Overdue';
}

function isSortBy(value: string | null): value is InvoiceSortBy {
  return value === 'invoiceDate' || value === 'dueDate' || value === 'totalAmount';
}

function isOrdering(value: string | null): value is Ordering {
  return value === 'ASC' || value === 'DESC';
}

function sortInvoices(
  invoices: InvoiceListItem[],
  sortBy: InvoiceSortBy,
  ordering: Ordering,
): InvoiceListItem[] {
  return [...invoices].sort((firstInvoice, secondInvoice) => {
    let firstValue: string | number = firstInvoice[sortBy];
    let secondValue: string | number = secondInvoice[sortBy];

    if (sortBy === 'totalAmount') {
      firstValue = Number(firstInvoice.totalAmount);
      secondValue = Number(secondInvoice.totalAmount);
    }

    if (firstValue < secondValue) {
      return ordering === 'ASC' ? -1 : 1;
    }

    if (firstValue > secondValue) {
      return ordering === 'ASC' ? 1 : -1;
    }

    return 0;
  });
}

export const invoiceHandlers = [
  http.get(`${API_BASE_URL}/invoices`, ({ request }) => {
    const url = new URL(request.url);

    const keyword = url.searchParams.get('keyword')?.toLowerCase().trim();
    const statusParam = url.searchParams.get('status');
    const sortByParam = url.searchParams.get('sortBy');
    const orderingParam = url.searchParams.get('ordering');
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');

    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);

    const status = isInvoiceStatus(statusParam) ? statusParam : undefined;
    const sortBy = isSortBy(sortByParam) ? sortByParam : 'invoiceDate';
    const ordering = isOrdering(orderingParam) ? orderingParam : 'DESC';

    let filteredInvoices = mockInvoices;

    if (keyword) {
      filteredInvoices = filteredInvoices.filter((invoice) => {
        return (
          invoice.invoiceNumber.toLowerCase().includes(keyword) ||
          invoice.customerName.toLowerCase().includes(keyword)
        );
      });
    }

    if (status) {
      filteredInvoices = filteredInvoices.filter((invoice) => invoice.status === status);
    }

    if (fromDate) {
      filteredInvoices = filteredInvoices.filter((invoice) => invoice.invoiceDate >= fromDate);
    }

    if (toDate) {
      filteredInvoices = filteredInvoices.filter((invoice) => invoice.invoiceDate <= toDate);
    }

    const sortedInvoices = sortInvoices(filteredInvoices, sortBy, ordering);

    const startIndex = (page - 1) * pageSize;
    const pagedInvoices = sortedInvoices.slice(startIndex, startIndex + pageSize);

    const response: InvoiceListResponse = {
      data: pagedInvoices,
      paging: {
        page,
        pageSize,
        total: filteredInvoices.length,
      },
    };

    return HttpResponse.json(response, { status: 200 });
  }),
];
