import { useInvoiceListQuery } from '@/features/invoices/hooks/use-invoice-list-query';
import { useInvoices } from '@/features/invoices/hooks/use-invoices';

import { InvoiceListContent } from './InvoiceListContent';
import { InvoiceListHeader } from './InvoiceListHeader';
import { InvoiceSummaryTiles } from './InvoiceSummaryTiles';
import { buildTileSummary } from './invoice-summary.mapper';

export function InvoiceListPage() {
  const { query, updateQuery, resetQuery } = useInvoiceListQuery();
  const invoicesQuery = useInvoices(query);

  const summary = buildTileSummary(invoicesQuery.data?.summary ?? null);

  return (
    <div className="space-y-5">
      <InvoiceListHeader />
      <InvoiceSummaryTiles summary={summary} />
      <InvoiceListContent
        invoicesQuery={invoicesQuery}
        query={query}
        onQueryChange={updateQuery}
        onQueryReset={resetQuery}
      />
    </div>
  );
}
