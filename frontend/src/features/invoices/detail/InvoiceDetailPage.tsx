import { useParams } from 'react-router';

import {
  CustomerInformationCard,
  InvoiceDetailHeader,
  InvoiceInformationCard,
  InvoiceItemsCard,
  InvoicePrintDocument,
  InvoiceSummaryCard,
  InvoiceTotalsCard,
} from '@/features/invoices/components/InvoiceDetailCards';
import { useInvoiceDetail } from '@/features/invoices/hooks/use-invoice-detail';
import { getApiErrorMessage } from '@/utils/api-error';

import { InvoiceDetailError } from './InvoiceDetailError';
import { InvoiceDetailSkeleton } from './InvoiceDetailSkeleton';

export function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const invoiceQuery = useInvoiceDetail(invoiceId);

  if (!invoiceId) {
    return (
      <InvoiceDetailError
        title="Invoice not found"
        message="The invoice URL is missing an invoice id."
      />
    );
  }

  if (invoiceQuery.isLoading) {
    return <InvoiceDetailSkeleton />;
  }

  if (invoiceQuery.isError) {
    return (
      <InvoiceDetailError
        title="Failed to load invoice"
        message={getApiErrorMessage(
          invoiceQuery.error,
          'Failed to load invoice.',
        )}
      />
    );
  }

  const invoice = invoiceQuery.data;

  if (!invoice) {
    return (
      <InvoiceDetailError
        title="Invoice not found"
        message="We could not find this invoice."
      />
    );
  }

  return (
    <>
      <div className="invoice-detail-screen">
        <InvoiceDetailHeader status={invoice.status} />

        <div className="mt-6 space-y-6">
          <InvoiceSummaryCard invoice={invoice} />

          <div className="grid gap-6 lg:grid-cols-2">
            <CustomerInformationCard invoice={invoice} />
            <InvoiceInformationCard invoice={invoice} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <InvoiceItemsCard invoice={invoice} />
            <InvoiceTotalsCard invoice={invoice} />
          </div>
        </div>
      </div>

      <InvoicePrintDocument invoice={invoice} />
    </>
  );
}
