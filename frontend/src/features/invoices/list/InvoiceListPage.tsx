import { getApiErrorMessage } from '@/utils/api-error';

import { useInvoiceListQuery } from '@/features/invoices/hooks/use-invoice-list-query';
import { useInvoices } from '@/features/invoices/hooks/use-invoices';

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

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <InvoiceListContent.Filters
            query={query}
            onChange={updateQuery}
            onReset={resetQuery}
          />
        </div>

        <InvoiceListContent.Body
          invoices={invoices}
          paging={paging}
          query={query}
          isLoading={invoicesQuery.isLoading}
          isFetching={invoicesQuery.isFetching}
          isError={invoicesQuery.isError}
          errorMessage={errorMessage}
          onQueryChange={updateQuery}
        />
      </div>
    </div>
  );
}
