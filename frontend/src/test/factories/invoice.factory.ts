import type {
  InvoiceDetail,
  InvoiceListItem,
  InvoiceListResponse,
  InvoiceStatus,
  InvoiceSummary,
  Paging,
} from '@/api/types';

export function createMockInvoiceListItem(
  overrides: Partial<InvoiceListItem> = {},
): InvoiceListItem {
  return {
    id: 'invoice-1',
    invoiceNumber: 'INV-2026-001',
    customerName: 'Acme Corporation',
    invoiceDate: '2026-05-12',
    dueDate: '2026-05-26',
    currency: 'AUD',
    currencySymbol: 'AU$',
    totalAmount: '2450.00',
    status: 'Paid',
    ...overrides,
  };
}

export function createMockInvoiceDetail(
  overrides: Partial<InvoiceDetail> = {},
): InvoiceDetail {
  const baseInvoice = createMockInvoiceListItem();

  return {
    id: baseInvoice.id,
    invoiceNumber: baseInvoice.invoiceNumber,
    invoiceReference: 'WEB-REDESIGN-2026-1',
    invoiceDate: baseInvoice.invoiceDate,
    dueDate: baseInvoice.dueDate,
    currency: baseInvoice.currency,
    currencySymbol: baseInvoice.currencySymbol,
    description: 'Website redesign and development services.',
    status: baseInvoice.status,
    customer: {
      fullname: baseInvoice.customerName,
      email: 'acme.corporation@example.com',
      mobileNumber: '+61 412 345 678',
      address: '12 Collins Street, Melbourne VIC 3000, Australia',
    },
    items: [
      {
        id: `${baseInvoice.id}-item-1`,
        name: 'UI/UX Design',
        quantity: 1,
        rate: '1200.00',
      },
      {
        id: `${baseInvoice.id}-item-2`,
        name: 'Frontend Development',
        quantity: 1,
        rate: '1500.00',
      },
      {
        id: `${baseInvoice.id}-item-3`,
        name: 'QA & Testing',
        quantity: 1,
        rate: '300.00',
      },
    ],
    invoiceSubTotal: baseInvoice.totalAmount,
    taxPercentage: '10.00',
    totalTax: '500.00',
    totalDiscount: '100.00',
    totalAmount: baseInvoice.totalAmount,
    totalPaid: baseInvoice.status === 'Paid' ? baseInvoice.totalAmount : '0.00',
    balanceAmount:
      baseInvoice.status === 'Paid' ? '0.00' : baseInvoice.totalAmount,
    createdAt: `${baseInvoice.invoiceDate}T09:15:00.000Z`,
    ...overrides,
  };
}

export function createMockInvoiceDetailFromListItem(
  invoice: InvoiceListItem,
  index = 0,
): InvoiceDetail {
  return createMockInvoiceDetail({
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    invoiceReference: `WEB-REDESIGN-2026-${index + 1}`,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    currency: invoice.currency,
    currencySymbol: invoice.currencySymbol,
    status: invoice.status,
    customer: {
      fullname: invoice.customerName,
      email: `${invoice.customerName.toLowerCase().replaceAll(/\W+/g, '.')}@example.com`,
      mobileNumber: '+61 412 345 678',
      address: '12 Collins Street, Melbourne VIC 3000, Australia',
    },
    invoiceSubTotal: invoice.totalAmount,
    totalAmount: invoice.totalAmount,
    totalPaid: invoice.status === 'Paid' ? invoice.totalAmount : '0.00',
    balanceAmount: invoice.status === 'Paid' ? '0.00' : invoice.totalAmount,
    createdAt: `${invoice.invoiceDate}T09:15:00.000Z`,
  });
}

export function createMockPaging(overrides: Partial<Paging> = {}): Paging {
  return {
    page: 1,
    pageSize: 10,
    total: 1,
    ...overrides,
  };
}

export function createMockInvoiceSummary(
  overrides: Partial<InvoiceSummary> = {},
): InvoiceSummary {
  return {
    totalRevenue: '2450.00',
    totalPaid: '2450.00',
    totalPending: '0.00',
    totalOverdue: '0.00',
    totalDraft: '0.00',
    paidCount: 1,
    pendingCount: 0,
    overdueCount: 0,
    draftCount: 0,
    currency: 'AUD',
    currencySymbol: 'AU$',
    currencyCount: 1,
    ...overrides,
  };
}

export function createMockInvoiceListResponse(
  overrides: Partial<InvoiceListResponse> = {},
): InvoiceListResponse {
  return {
    data: [createMockInvoiceListItem()],
    paging: createMockPaging(),
    ...overrides,
  };
}

export function createMockInvoiceListItemByStatus(
  status: InvoiceStatus,
  overrides: Partial<InvoiceListItem> = {},
): InvoiceListItem {
  return createMockInvoiceListItem({
    id: `invoice-${status.toLowerCase()}`,
    invoiceNumber: `INV-2026-${status.toUpperCase()}`,
    status,
    ...overrides,
  });
}
