import { describe, expect, it } from 'vitest';

import { ApiResponseValidationError } from '@/api/parse-api-response';
import type {
  InvoiceDetail,
  InvoiceListResponse,
  InvoiceSummary,
} from '@/api/types';

import {
  parseCreateInvoiceResponse,
  parseInvoiceDetailResponse,
  parseInvoiceListResponse,
  parseInvoiceSummaryResponse,
} from './invoices.schema';

describe('parseInvoiceListResponse', () => {
  it('parses a valid invoice list response', () => {
    // Arrange
    const response = createInvoiceListResponse();

    // Act
    const result = parseInvoiceListResponse(response);

    // Assert
    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toMatchObject({
      id: 'invoice-1',
      invoiceNumber: 'INV-2026-001',
      customerName: 'Acme Corp',
      status: 'Paid',
    });
    expect(result.paging.total).toBe(1);
    expect(result).not.toHaveProperty('summary');
  });

  it('rejects an invalid invoice status', () => {
    // Arrange
    const response = {
      ...createInvoiceListResponse(),
      data: [
        {
          ...createInvoiceListResponse().data[0],
          status: 'Archived',
        },
      ],
    } as unknown as InvoiceListResponse;

    // Act + Assert
    expect(() => parseInvoiceListResponse(response)).toThrow(
      ApiResponseValidationError,
    );
  });

  it('rejects invalid numeric string values', () => {
    // Arrange
    const response = createInvoiceListResponse({
      data: [
        {
          ...createInvoiceListResponse().data[0],
          totalAmount: 'not-a-number',
        },
      ],
    });

    // Act + Assert
    expect(() => parseInvoiceListResponse(response)).toThrow(
      ApiResponseValidationError,
    );
  });

  it('rejects a response without paging metadata', () => {
    // Arrange
    const response = {
      data: createInvoiceListResponse().data,
    };

    // Act + Assert
    expect(() => parseInvoiceListResponse(response)).toThrow(
      ApiResponseValidationError,
    );
  });
});

describe('parseInvoiceSummaryResponse', () => {
  it('parses a valid summary response', () => {
    // Arrange
    const response = createInvoiceSummaryResponse();

    // Act
    const result = parseInvoiceSummaryResponse(response);

    // Assert
    expect(result).toMatchObject({
      totalRevenue: '270.00',
      paidCount: 1,
      currency: 'AUD',
    });
  });

  it('rejects a summary with an invalid numeric string', () => {
    // Arrange
    const response = createInvoiceSummaryResponse({
      totalRevenue: 'not-a-number',
    });

    // Act + Assert
    expect(() => parseInvoiceSummaryResponse(response)).toThrow(
      ApiResponseValidationError,
    );
  });
});

describe('parseInvoiceDetailResponse', () => {
  it('parses a valid invoice detail response', () => {
    // Arrange
    const response = createInvoiceDetailResponse();

    // Act
    const result = parseInvoiceDetailResponse(response);

    // Assert
    expect(result).toMatchObject({
      id: 'invoice-1',
      invoiceNumber: 'INV-2026-001',
      status: 'Draft',
      customer: {
        fullname: 'Acme Corp',
        email: 'billing@acme.test',
      },
    });
    expect(result.items).toHaveLength(1);
  });

  it('rejects invalid invoice item quantity', () => {
    // Arrange
    const response = createInvoiceDetailResponse({
      items: [
        {
          ...createInvoiceDetailResponse().items[0],
          quantity: 0,
        },
      ],
    });

    // Act + Assert
    expect(() => parseInvoiceDetailResponse(response)).toThrow(
      ApiResponseValidationError,
    );
  });

  it('rejects invalid balance amount', () => {
    // Arrange
    const response = createInvoiceDetailResponse({
      balanceAmount: 'invalid',
    });

    // Act + Assert
    expect(() => parseInvoiceDetailResponse(response)).toThrow(
      ApiResponseValidationError,
    );
  });
});

describe('parseCreateInvoiceResponse', () => {
  it('parses create invoice response as invoice detail', () => {
    // Arrange
    const response = createInvoiceDetailResponse({
      id: 'invoice-new',
      invoiceNumber: 'INV-2026-NEW',
    });

    // Act
    const result = parseCreateInvoiceResponse(response);

    // Assert
    expect(result.id).toBe('invoice-new');
    expect(result.invoiceNumber).toBe('INV-2026-NEW');
  });
});

function createInvoiceListResponse(
  overrides: Partial<InvoiceListResponse> = {},
): InvoiceListResponse {
  return {
    data: [
      {
        id: 'invoice-1',
        invoiceNumber: 'INV-2026-001',
        customerName: 'Acme Corp',
        invoiceDate: '2026-06-28',
        dueDate: '2026-07-12',
        currency: 'AUD',
        currencySymbol: 'AU$',
        totalAmount: '270.00',
        status: 'Paid',
      },
    ],
    paging: {
      page: 1,
      pageSize: 10,
      total: 1,
    },
    ...overrides,
  };
}

function createInvoiceSummaryResponse(
  overrides: Partial<InvoiceSummary> = {},
): InvoiceSummary {
  return {
    totalRevenue: '270.00',
    totalPaid: '270.00',
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

function createInvoiceDetailResponse(
  overrides: Partial<InvoiceDetail> = {},
): InvoiceDetail {
  return {
    id: 'invoice-1',
    invoiceNumber: 'INV-2026-001',
    invoiceReference: 'PO-1234',
    invoiceDate: '2026-06-28',
    dueDate: '2026-07-12',
    currency: 'AUD',
    currencySymbol: 'AU$',
    description: 'Website services',
    status: 'Draft',
    customer: {
      fullname: 'Acme Corp',
      email: 'billing@acme.test',
      mobileNumber: '+61 400 123 456',
      address: '123 Market Street',
    },
    items: [
      {
        id: 'invoice-item-1',
        name: 'Website Design',
        quantity: 1,
        rate: '250.00',
      },
    ],
    invoiceSubTotal: '250.00',
    taxPercentage: '10.00',
    totalTax: '25.00',
    totalDiscount: '5.00',
    totalAmount: '270.00',
    totalPaid: '0.00',
    balanceAmount: '270.00',
    createdAt: '2026-06-28T00:00:00.000Z',
    ...overrides,
  };
}
