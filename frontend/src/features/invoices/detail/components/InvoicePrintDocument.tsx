import type { InvoiceDetail } from '@/api/types';
import {
  getFormattedInvoiceItemRate,
  getInvoiceDetailViewModel,
  getInvoiceItemLineTotal,
} from '@/features/invoices/detail/invoice-detail.mapper';
import { formatLineAmount } from '@/shared/lib/format';

type InvoicePrintDocumentProps = {
  invoice: InvoiceDetail;
};

export function InvoicePrintDocument({ invoice }: InvoicePrintDocumentProps) {
  const vm = getInvoiceDetailViewModel(invoice);

  return (
    <section className="invoice-print-root" aria-label="Printable invoice">
      <div className="invoice-print-card">
        <header className="invoice-print-header flex items-start justify-between gap-8 border-b border-slate-200 pb-8">
          <img
            src="/brand/simple-invoice-logo.png"
            alt="SimpleInvoice"
            className="h-14 w-auto"
          />

          <div className="text-right">
            <p className="text-2xl font-medium text-slate-500">Invoice Number</p>
            <p className="mt-3 rounded-full bg-slate-100 px-4 py-2 text-2xl font-bold tracking-wide text-slate-700">
              {invoice.invoiceNumber}
            </p>
          </div>
        </header>

        <div className="invoice-print-parties grid grid-cols-2 gap-12 border-b border-slate-200 py-8 text-xl">
          <div>
            <p className="font-bold text-slate-500">Billed By:</p>
            <p className="mt-6 font-bold text-slate-950">101 Digital PTE LTD</p>
            <p className="mt-3 leading-8 text-slate-600">
              Full Stack Engineering Assessment
              <br />
              Singapore
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-500">Billed To:</p>
            <p className="mt-6 font-bold text-slate-950">{invoice.customer.fullname}</p>
            <p className="mt-3 leading-8 text-slate-600">
              {invoice.customer.address || 'Customer address'}
            </p>
            <p className="mt-6 text-slate-600">Email: {invoice.customer.email}</p>
            {hasContent(invoice.customer.mobileNumber) ? (
              <p className="mt-2 text-slate-600">Mobile: {invoice.customer.mobileNumber}</p>
            ) : null}
          </div>
        </div>

        <div className="invoice-print-meta-grid grid grid-cols-3 gap-x-10 gap-y-8 border-b border-slate-200 py-8 text-xl">
          <PrintMeta label="Invoice Date" value={vm.invoiceDate} />
          <PrintMeta label="Due Date" value={vm.dueDate} />
          <PrintMeta label="Currency" value={vm.currencyLabel} />
          <PrintMeta label="Reference" value={invoice.invoiceReference || '-'} />
          <PrintMeta label="Description" value={invoice.description || '-'} />
        </div>

        <div className="invoice-print-items invoice-print-avoid-break mt-10 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-left text-xl">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-7 py-5 font-bold">#</th>
                <th className="px-7 py-5 font-bold">Item Name</th>
                <th className="px-7 py-5 font-bold">Qty</th>
                <th className="px-7 py-5 font-bold">Rate</th>
                <th className="px-7 py-5 text-right font-bold">Amount</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className="border-t border-slate-200 text-slate-800">
                  <td className="px-7 py-6">{index + 1}</td>
                  <td className="px-7 py-6 font-bold text-slate-900">{item.name}</td>
                  <td className="px-7 py-6">{item.quantity}</td>
                  <td className="px-7 py-6">
                    {getFormattedInvoiceItemRate(invoice, item)}
                  </td>
                  <td className="px-7 py-6 text-right font-bold text-slate-950">
                    {getInvoiceItemLineTotal(invoice, item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-print-totals invoice-print-avoid-break ml-auto mt-10 max-w-xl space-y-6 text-xl">
          <PrintTotalLine
            label="Subtotal"
            value={vm.subtotal}
          />
          <PrintTotalLine
            label={`Tax Amount (${Number(invoice.taxPercentage).toFixed(0)}%)`}
            value={vm.taxAmount}
          />
          <PrintTotalLine
            label="Discount Amount"
            value={`-${vm.discountAmount}`}
          />
          <PrintTotalLine
            label={`Total Amount (${invoice.currency})`}
            value={formatLineAmount(invoice.totalAmount, invoice.currencySymbol)}
            strong
          />
        </div>

        <PrintStatusPanel invoice={invoice} />
      </div>
    </section>
  );
}

function PrintMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-bold text-slate-500">{label}</p>
      <p className="mt-5 font-bold text-slate-800">{value}</p>
    </div>
  );
}

function PrintTotalLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="invoice-print-total-line flex items-center justify-between gap-10">
      <span className={strong ? 'text-2xl font-bold text-slate-950' : 'font-medium text-slate-700'}>
        {label}
      </span>
      <span className={strong ? 'text-4xl font-bold text-blue-600' : 'font-bold text-slate-950'}>
        {value}
      </span>
    </div>
  );
}

function PrintStatusPanel({ invoice }: InvoicePrintDocumentProps) {
  const statusClassName = invoice.status.toLowerCase();

  return (
    <div className="invoice-print-status invoice-print-avoid-break mt-8 rounded-2xl border border-slate-200">
      <p className="invoice-print-status-heading font-bold text-slate-700">Payment Status</p>

      <div className="invoice-print-status-grid mt-5 grid grid-cols-3 gap-6">
        <div className="invoice-print-status-metric">
          <p className="invoice-print-status-label text-slate-500">Status</p>
          <span className={`invoice-print-status-pill invoice-print-status-pill--${statusClassName}`}>
            <span className="invoice-print-status-symbol" aria-hidden="true" />
            {invoice.status}
          </span>
        </div>

        <PrintStatusMetric label="Due Date" value={getInvoiceDetailViewModel(invoice).dueDate} />
        <PrintStatusMetric
          label={invoice.status === 'Paid' ? 'Payment' : 'Balance'}
          value={getInvoiceDetailViewModel(invoice).printStatusValue}
          emphasize={invoice.status !== 'Paid' && Number(invoice.balanceAmount) > 0}
        />
      </div>
    </div>
  );
}

function PrintStatusMetric({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="invoice-print-status-metric">
      <p className="invoice-print-status-label text-slate-500">{label}</p>
      <p
        className={
          emphasize
            ? 'invoice-print-status-value invoice-print-status-value--emphasis'
            : 'invoice-print-status-value text-slate-800'
        }
      >
        {value}
      </p>
    </div>
  );
}

function hasContent(value: string | null | undefined) {
  return Boolean(value?.trim());
}
