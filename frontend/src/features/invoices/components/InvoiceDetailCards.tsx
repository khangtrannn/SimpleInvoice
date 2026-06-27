import type { ReactNode } from 'react';
import {
  Calendar,
  ClipboardList,
  Copy,
  FileText,
  Mail,
  MapPin,
  Phone,
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

export function InvoiceDetailHeader() {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Invoice Details</h1>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/invoices" className="hover:text-blue-600">
            Invoices
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-700">Invoice Details</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/invoices"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
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
      <div className="grid gap-6 lg:grid-cols-5">
        <SummaryBlock label="Invoice Number">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-slate-950">{invoice.invoiceNumber}</p>
            <button
              type="button"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Copy invoice number"
              onClick={() => navigator.clipboard?.writeText(invoice.invoiceNumber)}
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3">
            <InvoiceStatusBadge status={invoice.status} />
          </div>
        </SummaryBlock>

        <SummaryBlock label="Invoice Date">
          <div className="flex items-center gap-2 text-slate-800">
            <Calendar className="h-5 w-5 text-slate-500" aria-hidden="true" />
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
        <table className="w-full min-w-[760px] border-collapse text-left">
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
                  <p className="mt-1 font-medium text-slate-800">
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
          valueClassName="text-emerald-600"
        />

        <div className="rounded-xl border border-red-100 bg-red-50/70 px-4 py-3">
          <TotalLine
            label="Outstanding Balance"
            value={formatMoney(invoice.balanceAmount, invoice.currency, invoice.currencySymbol)}
            strong
            labelClassName="text-red-600"
            valueClassName="text-red-600"
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
      <span className="mt-0.5 text-slate-500">{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      {children}
    </span>
  );
}

function hasContent(value: string | null | undefined) {
  return Boolean(value?.trim());
}
