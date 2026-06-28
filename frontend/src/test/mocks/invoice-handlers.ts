import { http, HttpResponse } from 'msw';

import type {
  InvoiceDetail,
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

const mockInvoiceDetails: Record<string, InvoiceDetail> = Object.fromEntries(
  mockInvoices.map((invoice, index) => [
    invoice.id,
    {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceReference: `WEB-REDESIGN-2026-${index + 1}`,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency,
      currencySymbol: invoice.currencySymbol,
      description: 'Website redesign and development services.',
      status: invoice.status,
      customer: {
        fullname: invoice.customerName,
        email: `${invoice.customerName.toLowerCase().replaceAll(/\W+/g, '.')}@example.com`,
        mobileNumber: '+61 412 345 678',
        address: '12 Collins Street, Melbourne VIC 3000, Australia',
      },
      items: [
        {
          id: `${invoice.id}-item-1`,
          name: 'UI/UX Design',
          quantity: 1,
          rate: '1200.00',
        },
        {
          id: `${invoice.id}-item-2`,
          name: 'Frontend Development',
          quantity: 1,
          rate: '1500.00',
        },
        {
          id: `${invoice.id}-item-3`,
          name: 'QA & Testing',
          quantity: 1,
          rate: '300.00',
        },
      ],
      invoiceSubTotal: invoice.totalAmount,
      taxPercentage: '10.00',
      totalTax: '500.00',
      totalDiscount: '100.00',
      totalAmount: invoice.totalAmount,
      totalPaid: invoice.status === 'Paid' ? invoice.totalAmount : '0.00',
      balanceAmount: invoice.status === 'Paid' ? '0.00' : invoice.totalAmount,
      createdAt: `${invoice.invoiceDate}T09:15:00.000Z`,
    },
  ]),
);

function isInvoiceStatus(value: string | null): value is InvoiceStatus {
  return value === 'Draft' || value === 'Pending' || value === 'Paid' || value === 'Overdue';
}

function isSortBy(value: string | null): value is InvoiceSortBy {
  return value === 'createdAt' || value === 'invoiceDate' || value === 'dueDate' || value === 'totalAmount';
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
    let firstValue: string | number;
    let secondValue: string | number;

    if (sortBy === 'createdAt') {
      firstValue = mockInvoices.indexOf(firstInvoice);
      secondValue = mockInvoices.indexOf(secondInvoice);
    } else if (sortBy === 'totalAmount') {
      firstValue = Number(firstInvoice.totalAmount);
      secondValue = Number(secondInvoice.totalAmount);
    } else {
      firstValue = firstInvoice[sortBy];
      secondValue = secondInvoice[sortBy];
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
  http.get(`${API_BASE_URL}/invoices/:invoiceId`, ({ params }) => {
    const invoiceId = String(params.invoiceId);
    const invoice = mockInvoiceDetails[invoiceId];

    if (!invoice) {
      return HttpResponse.json(
        {
          statusCode: 404,
          message: 'Invoice not found',
          error: 'Not Found',
          timestamp: '2026-06-27T10:00:00.000Z',
          path: `/invoices/${invoiceId}`,
        },
        { status: 404 },
      );
    }

    return HttpResponse.json(invoice, { status: 200 });
  }),

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
    const sortBy = isSortBy(sortByParam) ? sortByParam : 'createdAt';
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

    const today = new Date().toISOString().slice(0, 10);
    const paidInvoices = filteredInvoices.filter((inv) => inv.status === 'Paid');
    const pendingInvoices = filteredInvoices.filter((inv) => inv.status === 'Pending' && inv.dueDate >= today);
    const overdueInvoices = filteredInvoices.filter((inv) => inv.status !== 'Paid' && inv.dueDate < today);
    const draftInvoices = filteredInvoices.filter((inv) => inv.status === 'Draft');
    const paidTotal = paidInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const draftTotal = draftInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const currencies = [...new Set(filteredInvoices.map((inv) => inv.currency))];

    const response: InvoiceListResponse = {
      data: pagedInvoices,
      paging: {
        page,
        pageSize,
        total: filteredInvoices.length,
      },
      summary: {
        totalRevenue: totalRevenue.toFixed(2),
        totalPaid: paidTotal.toFixed(2),
        totalPending: pendingTotal.toFixed(2),
        totalOverdue: overdueTotal.toFixed(2),
        totalDraft: draftTotal.toFixed(2),
        paidCount: paidInvoices.length,
        pendingCount: pendingInvoices.length,
        overdueCount: overdueInvoices.length,
        draftCount: draftInvoices.length,
        currency: currencies[0] ?? null,
        currencySymbol: filteredInvoices[0]?.currencySymbol ?? null,
        currencyCount: currencies.length,
      },
    };

    return HttpResponse.json(response, { status: 200 });
  }),
];
