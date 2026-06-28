import { describe, expect, it } from 'vitest';

import {
  normalizeInvoiceListQuery,
  parseInvoiceListSearchParams,
  serializeInvoiceListQuery,
} from './invoice-list-query.schema';

describe('parseInvoiceListSearchParams', () => {
  it('returns default query when search params are empty', () => {
    // Arrange
    const searchParams = new URLSearchParams();

    // Act
    const query = parseInvoiceListSearchParams(searchParams);

    // Assert
    expect(query).toEqual({
      page: 1,
      pageSize: 10,
      keyword: undefined,
      status: undefined,
      sortBy: 'createdAt',
      ordering: 'DESC',
      fromDate: undefined,
      toDate: undefined,
    });
  });

  it('parses valid query params', () => {
    // Arrange
    const searchParams = new URLSearchParams({
      page: '2',
      pageSize: '20',
      keyword: 'INV-2026',
      status: 'Paid',
      sortBy: 'dueDate',
      ordering: 'ASC',
      fromDate: '2026-06-01',
      toDate: '2026-06-30',
    });

    // Act
    const query = parseInvoiceListSearchParams(searchParams);

    // Assert
    expect(query).toEqual({
      page: 2,
      pageSize: 20,
      keyword: 'INV-2026',
      status: 'Paid',
      sortBy: 'dueDate',
      ordering: 'ASC',
      fromDate: '2026-06-01',
      toDate: '2026-06-30',
    });
  });

  it('normalizes invalid page and page size', () => {
    // Arrange
    const searchParams = new URLSearchParams({
      page: '-1',
      pageSize: '999',
    });

    // Act
    const query = parseInvoiceListSearchParams(searchParams);

    // Assert
    expect(query.page).toBe(1);
    expect(query.pageSize).toBe(10);
  });

  it('normalizes invalid status, sort field, and ordering', () => {
    // Arrange
    const searchParams = new URLSearchParams({
      status: 'Archived',
      sortBy: 'customerName',
      ordering: 'DOWN',
    });

    // Act
    const query = parseInvoiceListSearchParams(searchParams);

    // Assert
    expect(query.status).toBeUndefined();
    expect(query.sortBy).toBe('createdAt');
    expect(query.ordering).toBe('DESC');
  });

  it('trims keyword and removes empty keyword', () => {
    // Arrange
    const searchParamsWithKeyword = new URLSearchParams({
      keyword: '  Acme  ',
    });

    const searchParamsWithEmptyKeyword = new URLSearchParams({
      keyword: '   ',
    });

    // Act
    const queryWithKeyword = parseInvoiceListSearchParams(searchParamsWithKeyword);
    const queryWithEmptyKeyword = parseInvoiceListSearchParams(searchParamsWithEmptyKeyword);

    // Assert
    expect(queryWithKeyword.keyword).toBe('Acme');
    expect(queryWithEmptyKeyword.keyword).toBeUndefined();
  });

  it('removes invalid date params', () => {
    // Arrange
    const searchParams = new URLSearchParams({
      fromDate: '2026-99-99',
      toDate: 'invalid-date',
    });

    // Act
    const query = parseInvoiceListSearchParams(searchParams);

    // Assert
    expect(query.fromDate).toBeUndefined();
    expect(query.toDate).toBeUndefined();
  });

  it('normalizes reversed date range', () => {
    // Arrange
    const searchParams = new URLSearchParams({
      fromDate: '2026-06-30',
      toDate: '2026-06-01',
    });

    // Act
    const query = parseInvoiceListSearchParams(searchParams);

    // Assert
    expect(query.fromDate).toBe('2026-06-01');
    expect(query.toDate).toBe('2026-06-30');
  });
});

describe('normalizeInvoiceListQuery', () => {
  it('normalizes a partial query into a complete invoice list query', () => {
    // Arrange
    const partialQuery = {
      page: 3,
      keyword: '  Acme  ',
      status: 'Pending' as const,
    };

    // Act
    const query = normalizeInvoiceListQuery(partialQuery);

    // Assert
    expect(query).toEqual({
      page: 3,
      pageSize: 10,
      keyword: 'Acme',
      status: 'Pending',
      sortBy: 'createdAt',
      ordering: 'DESC',
      fromDate: undefined,
      toDate: undefined,
    });
  });

  it('normalizes invalid date values from partial query', () => {
    // Arrange
    const partialQuery = {
      fromDate: 'invalid',
      toDate: '2026-06-30',
    };

    // Act
    const query = normalizeInvoiceListQuery(partialQuery);

    // Assert
    expect(query.fromDate).toBeUndefined();
    expect(query.toDate).toBe('2026-06-30');
  });
});

describe('serializeInvoiceListQuery', () => {
  it('serializes valid query into URLSearchParams', () => {
    // Arrange
    const query = {
      page: 2,
      pageSize: 20,
      keyword: 'Acme',
      status: 'Paid' as const,
      sortBy: 'dueDate' as const,
      ordering: 'ASC' as const,
      fromDate: '2026-06-01',
      toDate: '2026-06-30',
    };

    // Act
    const searchParams = serializeInvoiceListQuery(query);

    // Assert
    expect(searchParams.toString()).toBe(
      'page=2&pageSize=20&sortBy=dueDate&ordering=ASC&keyword=Acme&status=Paid&fromDate=2026-06-01&toDate=2026-06-30',
    );
  });

  it('does not serialize empty optional params', () => {
    // Arrange
    const query = {
      page: 1,
      pageSize: 10,
      keyword: '',
      status: undefined,
      sortBy: 'createdAt' as const,
      ordering: 'DESC' as const,
      fromDate: undefined,
      toDate: undefined,
    };

    // Act
    const searchParams = serializeInvoiceListQuery(query);

    // Assert
    expect(searchParams.toString()).toBe('page=1&pageSize=10&sortBy=createdAt&ordering=DESC');
  });
});
