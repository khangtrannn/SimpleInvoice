import { describe, expect, it } from 'vitest';

import { createMockInvoiceListItem } from '@/test/factories/invoice.factory';

import {
  buildInvoiceListResponse,
  buildInvoiceSummary,
  filterInvoices,
  paginateInvoices,
  parseInvoiceRequestUrl,
  sortInvoices,
} from './invoice-query';

describe('parseInvoiceRequestUrl', () => {
  it('parses invoice list query params with fallbacks', () => {
    const url = new URL(
      'http://localhost:4000/invoices?page=2&pageSize=20&keyword=Acme&status=Paid&sortBy=totalAmount&ordering=ASC',
    );

    const result = parseInvoiceRequestUrl(url);

    expect(result).toEqual({
      page: 2,
      pageSize: 20,
      keyword: 'acme',
      status: 'Paid',
      sortBy: 'totalAmount',
      ordering: 'ASC',
      fromDate: undefined,
      toDate: undefined,
    });
  });

  it('normalizes invalid query params', () => {
    const url = new URL(
      'http://localhost:4000/invoices?page=-1&pageSize=invalid&status=Archived&sortBy=unknown&ordering=DOWN',
    );

    const result = parseInvoiceRequestUrl(url);

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.status).toBeUndefined();
    expect(result.sortBy).toBe('createdAt');
    expect(result.ordering).toBe('DESC');
  });
});

describe('filterInvoices', () => {
  it('filters invoices by keyword and status', () => {
    const invoices = [
      createMockInvoiceListItem({
        id: 'invoice-1',
        invoiceNumber: 'INV-001',
        customerName: 'Acme Corp',
        status: 'Paid',
      }),
      createMockInvoiceListItem({
        id: 'invoice-2',
        invoiceNumber: 'INV-002',
        customerName: 'Beta Corp',
        status: 'Pending',
      }),
    ];

    const result = filterInvoices(invoices, {
      keyword: 'acme',
      status: 'Paid',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('invoice-1');
  });

  it('filters invoices by date range', () => {
    const invoices = [
      createMockInvoiceListItem({
        id: 'invoice-1',
        invoiceDate: '2026-06-01',
      }),
      createMockInvoiceListItem({
        id: 'invoice-2',
        invoiceDate: '2026-07-01',
      }),
    ];

    const result = filterInvoices(invoices, {
      fromDate: '2026-06-01',
      toDate: '2026-06-30',
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('invoice-1');
  });
});

describe('sortInvoices', () => {
  it('sorts invoices by amount descending', () => {
    const invoices = [
      createMockInvoiceListItem({
        id: 'invoice-low',
        totalAmount: '100.00',
      }),
      createMockInvoiceListItem({
        id: 'invoice-high',
        totalAmount: '500.00',
      }),
    ];

    const result = sortInvoices(invoices, 'totalAmount', 'DESC');

    expect(result.map((invoice) => invoice.id)).toEqual([
      'invoice-high',
      'invoice-low',
    ]);
  });
});

describe('paginateInvoices', () => {
  it('returns requested page of invoices', () => {
    const invoices = [
      createMockInvoiceListItem({ id: 'invoice-1' }),
      createMockInvoiceListItem({ id: 'invoice-2' }),
      createMockInvoiceListItem({ id: 'invoice-3' }),
    ];

    const result = paginateInvoices(invoices, 2, 2);

    expect(result.map((invoice) => invoice.id)).toEqual(['invoice-3']);
  });
});

describe('buildInvoiceListResponse', () => {
  it('builds paginated response without summary (summary lives on its own endpoint)', () => {
    const invoices = [
      createMockInvoiceListItem({
        id: 'invoice-1',
        totalAmount: '100.00',
        status: 'Paid',
      }),
      createMockInvoiceListItem({
        id: 'invoice-2',
        totalAmount: '200.00',
        status: 'Draft',
      }),
    ];

    const result = buildInvoiceListResponse(invoices, {
      page: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      ordering: 'DESC',
    });

    expect(result.data).toHaveLength(2);
    expect(result.paging.total).toBe(2);
    expect(result).not.toHaveProperty('summary');
  });
});

describe('buildInvoiceSummary', () => {
  it('aggregates totals and counts across the matching invoices', () => {
    const invoices = [
      createMockInvoiceListItem({
        id: 'invoice-1',
        totalAmount: '100.00',
        status: 'Paid',
      }),
      createMockInvoiceListItem({
        id: 'invoice-2',
        totalAmount: '200.00',
        status: 'Draft',
      }),
    ];

    const summary = buildInvoiceSummary(invoices);

    expect(summary.totalRevenue).toBe('300.00');
    expect(summary.paidCount).toBe(1);
    expect(summary.draftCount).toBe(1);
  });
});
