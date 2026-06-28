import type { ReactNode } from 'react';
import {
  Calendar,
  ChevronLeft,
  ClipboardList,
  Copy,
  FileText,
  Mail,
  MapPin,
  Phone,
  Printer,
  User,
} from 'lucide-react';
import { Link } from 'react-router';

import type { InvoiceDetail } from '@/api/types';
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge';
import {
  formatDate,
  formatDateTime,
  formatLineAmount,
  formatMoney,
  getDaysOverdue,
} from '@/utils/format';

type InvoiceDetailProps = {
  invoice: InvoiceDetail;
};

export function InvoiceDetailHeader({ status }: { status?: InvoiceDetail['status'] }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/invoices" className="hover:text-blue-600">
            Invoices
          </Link>
          <span>/</span>
          <span className="text-slate-700">Invoice Details</span>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Invoice Details</h1>
          {status ? <InvoiceStatusBadge status={status} /> : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          onClick={() => window.print()}
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print Invoice
        </button>

        <Link
          to="/invoices"
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Invoices
        </Link>
      </div>
    </div>
  );
}

export function InvoiceSummaryCard({ invoice }: InvoiceDetailProps) {
  const overdueDays = invoice.status === 'Overdue' ? getDaysOverdue(invoice.dueDate) : 0;

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <SummaryBlock label="Invoice Number">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-slate-950">{invoice.invoiceNumber}</p>
            <button
              type="button"
              className="rounded-lg p-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Copy invoice number"
              onClick={() => navigator.clipboard?.writeText(invoice.invoiceNumber)}
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </SummaryBlock>

        <SummaryBlock label="Invoice Date">
          <div className="flex items-center gap-2 text-slate-800">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            <span className="font-semibold">{formatDate(invoice.invoiceDate)}</span>
          </div>
        </SummaryBlock>

        <SummaryBlock label="Due Date">
          <div
            className={`flex items-center gap-2 ${
              invoice.status === 'Overdue' ? 'text-red-600' : 'text-slate-800'
            }`}
          >
            <Calendar className="h-5 w-5" aria-hidden="true" />
            <span className="font-semibold">{formatDate(invoice.dueDate)}</span>
          </div>

          {invoice.status === 'Overdue' && overdueDays > 0 ? (
            <p className="mt-2 text-sm font-semibold text-red-500">
              {overdueDays} days overdue
            </p>
          ) : null}
        </SummaryBlock>

        <SummaryBlock label="Total Amount">
          <p className="text-xl font-bold text-slate-950">
            {formatMoney(invoice.totalAmount, invoice.currency, invoice.currencySymbol)}
          </p>
        </SummaryBlock>

        <SummaryBlock label="Outstanding Balance">
          <p
            className={`text-xl font-bold ${
              Number(invoice.balanceAmount) > 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {formatMoney(invoice.balanceAmount, invoice.currency, invoice.currencySymbol)}
          </p>
        </SummaryBlock>
      </div>
    </section>
  );
}

export function CustomerInformationCard({ invoice }: InvoiceDetailProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <SectionIcon>
          <User className="h-5 w-5" aria-hidden="true" />
        </SectionIcon>
        <h2 className="text-lg font-bold text-slate-950">Customer Information</h2>
      </div>

      <h3 className="text-xl font-bold text-slate-950">{invoice.customer.fullname}</h3>

      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <InfoLine icon={<Mail className="h-5 w-5" />} value={invoice.customer.email} />
        <InfoLine icon={<Phone className="h-5 w-5" />} value={invoice.customer.mobileNumber} />
        <InfoLine icon={<MapPin className="h-5 w-5" />} value={invoice.customer.address} />
      </div>
    </section>
  );
}

export function InvoiceInformationCard({ invoice }: InvoiceDetailProps) {
  const hasReference = hasContent(invoice.invoiceReference);
  const hasDescription = hasContent(invoice.description);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <SectionIcon>
          <FileText className="h-5 w-5" aria-hidden="true" />
        </SectionIcon>
        <h2 className="text-lg font-bold text-slate-950">Invoice Information</h2>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-[180px_1fr]">
        {hasReference ? (
          <>
            <DetailLabel>Reference</DetailLabel>
            <DetailValue>{invoice.invoiceReference}</DetailValue>
          </>
        ) : null}

        <DetailLabel>Currency</DetailLabel>
        <DetailValue>
          {invoice.currency} {invoice.currencySymbol ? `(${invoice.currencySymbol})` : ''}
        </DetailValue>

        <DetailLabel>Created On</DetailLabel>
        <DetailValue>{formatDateTime(invoice.createdAt)}</DetailValue>

        {hasDescription ? (
          <>
            <DetailLabel>Description</DetailLabel>
            <DetailValue>{invoice.description}</DetailValue>
          </>
        ) : null}
      </dl>
    </section>
  );
}

export function InvoiceItemsCard({ invoice }: InvoiceDetailProps) {
  if (invoice.items.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <SectionIcon>
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
          </SectionIcon>
          <h2 className="text-lg font-bold text-slate-950">Invoice Items</h2>
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-sm text-slate-500">
              <th className="px-6 py-4 font-semibold">#</th>
              <th className="px-6 py-4 font-semibold">Item Name</th>
              <th className="px-6 py-4 font-semibold">Quantity</th>
              <th className="px-6 py-4 font-semibold">Rate</th>
              <th className="px-6 py-4 font-semibold">Line Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, index) => {
              const lineTotal = Number(item.rate) * item.quantity;

              return (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 text-sm text-slate-700 last:border-b-0"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{item.name}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">
                    {formatLineAmount(item.rate, invoice.currencySymbol)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {formatLineAmount(lineTotal, invoice.currencySymbol)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {invoice.items.map((item, index) => {
          const lineTotal = Number(item.rate) * item.quantity;

          return (
            <div key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Item #{index + 1}</p>
                  <p className="mt-1 font-semibold text-slate-950">{item.name}</p>
                </div>

                <p className="font-bold text-slate-950">
                  {formatLineAmount(lineTotal, invoice.currencySymbol)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Quantity</p>
                  <p className="mt-1 font-medium text-slate-800">{item.quantity}</p>
                </div>

                <div>
                  <p className="text-slate-500">Rate</p>
                  <p className="mt-1 font-medium text-blue-600">
                    {formatLineAmount(item.rate, invoice.currencySymbol)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function NotesCard({ invoice }: InvoiceDetailProps) {
  if (!hasContent(invoice.description)) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <SectionIcon>
          <FileText className="h-5 w-5" aria-hidden="true" />
        </SectionIcon>
        <h2 className="text-lg font-bold text-slate-950">Notes</h2>
      </div>

      <p className="text-sm leading-6 text-slate-600">
        {invoice.description}
      </p>
    </section>
  );
}

export function InvoiceTotalsCard({ invoice }: InvoiceDetailProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4 text-sm">
        <TotalLine
          label="Subtotal"
          value={formatMoney(invoice.invoiceSubTotal, invoice.currency, invoice.currencySymbol)}
        />
        <TotalLine
          label={`Tax (${Number(invoice.taxPercentage).toFixed(0)}%)`}
          value={formatMoney(invoice.totalTax, invoice.currency, invoice.currencySymbol)}
        />
        <TotalLine
          label="Discount"
          value={formatMoney(invoice.totalDiscount, invoice.currency, invoice.currencySymbol)}
        />

        <div className="border-t border-slate-200 pt-4">
          <TotalLine
            label="Total Invoice Amount"
            value={formatMoney(invoice.totalAmount, invoice.currency, invoice.currencySymbol)}
            strong
          />
        </div>

        <TotalLine
          label="Total Paid"
          value={formatMoney(invoice.totalPaid, invoice.currency, invoice.currencySymbol)}
        />

        {Number(invoice.balanceAmount) > 0 ? (
          <div className="rounded-xl border border-red-100 bg-red-50/70 px-4 py-3">
            <TotalLine
              label="Outstanding Balance"
              value={formatMoney(invoice.balanceAmount, invoice.currency, invoice.currencySymbol)}
              strong
              labelClassName="text-red-600"
              valueClassName="text-red-600"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
            <TotalLine
              label="Outstanding Balance"
              value={formatMoney(invoice.balanceAmount, invoice.currency, invoice.currencySymbol)}
              strong
              labelClassName="text-emerald-600"
              valueClassName="text-emerald-600"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export function InvoicePrintDocument({ invoice }: InvoiceDetailProps) {
  return (
    <section className="invoice-print-root" aria-label="Printable invoice">
      <div className="invoice-print-card">
        <header className="flex items-start justify-between gap-8 border-b border-slate-200 pb-8">
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

        <div className="grid grid-cols-2 gap-12 border-b border-slate-200 py-8 text-xl">
          <div>
            <p className="font-bold text-slate-500">Billed By:</p>
            <p className="mt-6 font-bold text-slate-950">SimpleInvoice</p>
            <p className="mt-3 leading-8 text-slate-600">
              Secure invoicing workspace
              <br />
              Australia
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

        <div className="grid grid-cols-3 gap-x-10 gap-y-8 border-b border-slate-200 py-8 text-xl">
          <PrintMeta label="Invoice Date" value={formatDate(invoice.invoiceDate)} />
          <PrintMeta label="Due Date" value={formatDate(invoice.dueDate)} />
          <PrintMeta label="Currency" value={getCurrencyLabel(invoice.currency)} />
          <PrintMeta label="Reference" value={invoice.invoiceReference || '-'} />
          <PrintMeta label="Description" value={invoice.description || '-'} />
        </div>

        <div className="invoice-print-avoid-break mt-10 overflow-hidden rounded-2xl border border-slate-200">
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
              {invoice.items.map((item, index) => {
                const lineTotal = Number(item.rate) * item.quantity;

                return (
                  <tr key={item.id} className="border-t border-slate-200 text-slate-800">
                    <td className="px-7 py-6">{index + 1}</td>
                    <td className="px-7 py-6 font-bold text-slate-900">{item.name}</td>
                    <td className="px-7 py-6">{item.quantity}</td>
                    <td className="px-7 py-6">
                      {formatLineAmount(item.rate, invoice.currencySymbol)}
                    </td>
                    <td className="px-7 py-6 text-right font-bold text-slate-950">
                      {formatLineAmount(lineTotal, invoice.currencySymbol)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="invoice-print-avoid-break ml-auto mt-10 max-w-xl space-y-6 text-xl">
          <PrintTotalLine
            label="Subtotal"
            value={formatLineAmount(invoice.invoiceSubTotal, invoice.currencySymbol)}
          />
          <PrintTotalLine
            label={`Tax Amount (${Number(invoice.taxPercentage).toFixed(0)}%)`}
            value={formatLineAmount(invoice.totalTax, invoice.currencySymbol)}
          />
          <PrintTotalLine
            label="Discount Amount"
            value={`-${formatLineAmount(Math.abs(Number(invoice.totalDiscount)), invoice.currencySymbol)}`}
          />
          <PrintTotalLine
            label={`Total Amount (${invoice.currency})`}
            value={formatLineAmount(invoice.totalAmount, invoice.currencySymbol)}
            strong
          />
        </div>
      </div>
    </section>
  );
}

function SummaryBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-slate-200 lg:border-r lg:pr-6 lg:last:border-r-0">
      <p className="mb-3 text-sm font-semibold text-slate-500">{label}</p>
      {children}
    </div>
  );
}

function TotalLine({
  label,
  value,
  strong = false,
  labelClassName = 'text-slate-700',
  valueClassName = 'text-slate-900',
}: {
  label: string;
  value: string;
  strong?: boolean;
  labelClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className={`${strong ? 'font-bold' : 'font-medium'} ${labelClassName}`}>{label}</span>
      <span className={`${strong ? 'text-lg font-bold' : 'font-semibold'} ${valueClassName}`}>
        {value}
      </span>
    </div>
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
    <div className="flex items-center justify-between gap-10">
      <span className={strong ? 'text-2xl font-bold text-slate-950' : 'font-medium text-slate-700'}>
        {label}
      </span>
      <span className={strong ? 'text-4xl font-bold text-blue-600' : 'font-bold text-slate-950'}>
        {value}
      </span>
    </div>
  );
}

function DetailLabel({ children }: { children: ReactNode }) {
  return <dt className="font-semibold text-slate-500">{children}</dt>;
}

function DetailValue({ children }: { children: ReactNode }) {
  return <dd className="font-semibold text-slate-800">{children}</dd>;
}

function InfoLine({ icon, value }: { icon: ReactNode; value: string | null }) {
  if (!hasContent(value)) {
    return null;
  }

  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-900">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
      {children}
    </span>
  );
}

function hasContent(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function getCurrencyLabel(currency: string) {
  const currencyNames: Record<string, string> = {
    AUD: 'AUD - Australian Dollar',
    USD: 'USD - US Dollar',
    GBP: 'GBP - British Pound',
  };

  return currencyNames[currency] ?? currency;
}
