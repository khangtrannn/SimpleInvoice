import { Link, useParams } from 'react-router';

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

export function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const invoiceQuery = useInvoiceDetail(invoiceId);

  if (!invoiceId) {
    return (
      <InvoiceDetailError
        title="Invalid invoice"
        message="The invoice ID is missing from the current route."
      />
    );
  }

  if (invoiceQuery.isLoading) {
    return <InvoiceDetailSkeleton />;
  }

  if (invoiceQuery.isError) {
    return (
      <InvoiceDetailError
        title="Unable to load invoice"
        message={getApiErrorMessage(invoiceQuery.error, 'Invoice not found.')}
      />
    );
  }

  const invoice = invoiceQuery.data;

  if (!invoice) {
    return <InvoiceDetailError title="Invoice not found" message="This invoice does not exist." />;
  }

  return (
    <>
      <div className="invoice-detail-screen">
        <InvoiceDetailHeader status={invoice.status} />
        <InvoiceSummaryCard invoice={invoice} />

        <div className="grid gap-6 md:grid-cols-2">
          <CustomerInformationCard invoice={invoice} />
          <InvoiceInformationCard invoice={invoice} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <InvoiceItemsCard invoice={invoice} />
          <InvoiceTotalsCard invoice={invoice} />
        </div>
      </div>

      <InvoicePrintDocument invoice={invoice} />
    </>
  );
}

function InvoiceDetailError({ title, message }: { title: string; message: string }) {
  return (
    <div>
      <div className="mb-8">
        <Link className="text-sm font-semibold text-slate-600 hover:text-blue-600" to="/invoices">
          Back to invoices
        </Link>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
        <h1 className="text-xl font-bold text-red-700">{title}</h1>
        <p className="mt-2 text-sm font-medium text-red-600">{message}</p>
      </div>
    </div>
  );
}

function InvoiceDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row">
        <div>
          <div className="h-8 w-56 rounded bg-slate-100" />
          <div className="mt-3 h-4 w-48 rounded bg-slate-100" />
        </div>

        <div className="flex gap-3">
          <div className="h-11 w-36 rounded-xl bg-slate-100" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index}>
              <div className="h-4 w-28 rounded bg-slate-100" />
              <div className="mt-4 h-6 w-36 rounded bg-slate-100" />
              <div className="mt-3 h-5 w-24 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-56 rounded bg-slate-100" />
          <div className="mt-8 space-y-4">
            <div className="h-5 w-48 rounded bg-slate-100" />
            <div className="h-5 w-72 rounded bg-slate-100" />
            <div className="h-5 w-64 rounded bg-slate-100" />
          </div>
        </div>

        <div className="h-64 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-56 rounded bg-slate-100" />
          <div className="mt-8 space-y-4">
            <div className="h-5 w-full rounded bg-slate-100" />
            <div className="h-5 w-3/4 rounded bg-slate-100" />
            <div className="h-5 w-5/6 rounded bg-slate-100" />
          </div>
        </div>
      </div>

      <div className="h-72 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-48 rounded bg-slate-100" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-5 rounded bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
