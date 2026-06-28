import { useInvoiceListQuery } from '@/features/invoices/hooks/use-invoice-list-query';
import { useInvoices } from '@/features/invoices/hooks/use-invoices';
import { getApiErrorMessage } from '@/utils/api-error';

import { InvoiceListContent } from './InvoiceListContent';
import { InvoiceListHeader } from './InvoiceListHeader';
import { InvoiceSummaryTiles } from './InvoiceSummaryTiles';
import { buildTileSummary } from './invoice-summary.mapper';

export function InvoiceListPage() {
  const { query, updateQuery, resetQuery } = useInvoiceListQuery();

  const invoicesQuery = useInvoices(query);
  const invoices = invoicesQuery.data?.data ?? [];
  const paging = invoicesQuery.data?.paging;
  const summary = buildTileSummary(invoicesQuery.data?.summary ?? null);

  const errorMessage = invoicesQuery.isError
    ? getApiErrorMessage(invoicesQuery.error, 'Failed to load invoices.')
    : undefined;

  return (
    <div className="space-y-5">
      <InvoiceListHeader />

      <InvoiceSummaryTiles summary={summary} />

      <InvoiceListContent
        invoices={invoices}
        paging={paging}
        query={query}
        isLoading={invoicesQuery.isLoading}
        isFetching={invoicesQuery.isFetching}
        isError={invoicesQuery.isError}
        errorMessage={errorMessage}
        onQueryChange={updateQuery}
        onQueryReset={resetQuery}
      />
    </div>
  );
}
