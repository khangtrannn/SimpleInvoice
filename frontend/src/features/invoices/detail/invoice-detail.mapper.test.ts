import { describe, expect, it } from 'vitest';

import type { InvoiceDetail } from '@/api/types';

import {
  getFormattedInvoiceItemRate,
  getInvoiceDetailViewModel,
  getInvoiceItemLineTotal,
} from './invoice-detail.mapper';

describe('getInvoiceDetailViewModel', () => {
  it('maps invoice detail into formatted view model', () => {
    // Arrange
    const invoice = createInvoiceDetail();

    // Act
    const result = getInvoiceDetailViewModel(invoice);

    // Assert
    expect(result.invoiceNumber).toBe('INV-2026-001');
    expect(result.invoiceDate).toBe('Jun 28, 2026');
    expect(result.dueDate).toBe('Jul 12, 2026');
    expect(result.totalAmount).toBe('AU$270.00 AUD');
    expect(result.balanceAmount).toBe('AU$270.00 AUD');
    expect(result.subtotal).toBe('AU$250.00');
    expect(result.taxAmount).toBe('AU$25.00');
    expect(result.discountAmount).toBe('AU$5.00');
    expect(result.totalPaid).toBe('AU$0.00');
    expect(result.hasReference).toBe(true);
    expect(result.hasDescription).toBe(true);
    expect(result.currencyLabel).toBe('AUD - Australian Dollar');
  });

  it('returns paid in full print status for paid invoice', () => {
    // Arrange
    const invoice = createInvoiceDetail({
      status: 'Paid',
      balanceAmount: '0.00',
    });

    // Act
    const result = getInvoiceDetailViewModel(invoice);

    // Assert
    expect(result.printStatusValue).toBe('Paid in full');
  });

  it('returns not issued print status for draft invoice', () => {
    // Arrange
    const invoice = createInvoiceDetail({
      status: 'Draft',
    });

    // Act
    const result = getInvoiceDetailViewModel(invoice);

    // Assert
    expect(result.printStatusValue).toBe('Not issued');
  });

  it('detects missing optional content', () => {
    // Arrange
    const invoice = createInvoiceDetail({
      invoiceReference: '   ',
      description: null,
    });

    // Act
    const result = getInvoiceDetailViewModel(invoice);

    // Assert
    expect(result.hasReference).toBe(false);
    expect(result.hasDescription).toBe(false);
  });
});

describe('invoice item formatting helpers', () => {
  it('formats invoice item rate and line total', () => {
    // Arrange
    const invoice = createInvoiceDetail();
    const item = invoice.items[0];

    // Act
    const formattedRate = getFormattedInvoiceItemRate(invoice, item);
    const lineTotal = getInvoiceItemLineTotal(invoice, item);

    // Assert
    expect(formattedRate).toBe('AU$250.00');
    expect(lineTotal).toBe('AU$250.00');
  });
});

function createInvoiceDetail(
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
