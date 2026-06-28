import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import type { InvoiceListItem, InvoiceListQuery } from '@/api/types';

import { InvoiceTableDesktop } from './InvoiceTableDesktop';
import { InvoiceTableMobile } from './InvoiceTableMobile';
import { getInvoiceTableRowViewModel } from './invoice-table.mapper';

type InvoiceTableProps = {
  invoices: InvoiceListItem[];
  query?: InvoiceListQuery;
  onSortChange?: (partial: Partial<InvoiceListQuery>) => void;
};

export function InvoiceTable({
  invoices,
  query,
  onSortChange,
}: InvoiceTableProps) {
  const navigate = useNavigate();

  const rows = useMemo(
    () => invoices.map((invoice) => getInvoiceTableRowViewModel(invoice)),
    [invoices],
  );

  function openInvoice(invoiceId: string) {
    navigate(`/invoices/${invoiceId}`);
  }

  return (
    <div className="overflow-hidden">
      <InvoiceTableDesktop
        rows={rows}
        query={query}
        onSortChange={onSortChange}
        onOpenInvoice={openInvoice}
      />

      <InvoiceTableMobile rows={rows} />
    </div>
  );
}
