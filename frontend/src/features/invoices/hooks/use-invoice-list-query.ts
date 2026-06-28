import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import type { InvoiceListQuery } from '@/api/types';
import {
  DEFAULT_INVOICE_LIST_ORDERING,
  DEFAULT_INVOICE_LIST_PAGE,
  DEFAULT_INVOICE_LIST_PAGE_SIZE,
  DEFAULT_INVOICE_LIST_SORT_BY,
  normalizeInvoiceListQuery,
  parseInvoiceListSearchParams,
  serializeInvoiceListQuery,
} from '@/features/invoices/list/invoice-list-query.schema';

export function useInvoiceListQuery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo(() => {
    return parseInvoiceListSearchParams(searchParams);
  }, [searchParams]);

  function updateQuery(nextQuery: Partial<InvoiceListQuery>) {
    const mergedQuery = normalizeInvoiceListQuery({
      ...query,
      ...nextQuery,
    });

    setSearchParams(serializeInvoiceListQuery(mergedQuery));
  }

  function resetQuery() {
    setSearchParams(
      serializeInvoiceListQuery({
        page: DEFAULT_INVOICE_LIST_PAGE,
        pageSize: DEFAULT_INVOICE_LIST_PAGE_SIZE,
        sortBy: DEFAULT_INVOICE_LIST_SORT_BY,
        ordering: DEFAULT_INVOICE_LIST_ORDERING,
      }),
    );
  }

  return {
    query,
    updateQuery,
    resetQuery,
  };
}
