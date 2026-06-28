import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import type { CreateInvoiceFormInput } from '@/features/invoices/schema/create-invoice.schema';

import { calculateInvoicePreview } from './create-invoice-calculations';
import { getDateInputValue } from './create-invoice.defaults';
import {
  formatPreviewDate,
  formatPreviewMoney,
} from './create-invoice-formatters';

type InvoicePreviewProps = {
  control: Control<CreateInvoiceFormInput>;
};

export function InvoicePreview({ control }: InvoicePreviewProps) {
  const values = useWatch({ control });
  const preview = calculateInvoicePreview(values);

  const customerName = values.customerName || 'Customer Name';
  const customerEmail = values.customerEmail || 'customer@example.com';
  const customerMobile = values.customerMobile || '+61 400 123 456';
  const customerAddress = values.customerAddress || 'Customer address';
  const invoiceNumber = values.invoiceNumber || 'INV-0000';
  const invoiceDate = values.invoiceDate || getDateInputValue();
  const dueDate = values.dueDate || getDateInputValue(14);
  const itemName = values.itemName || 'Item name';
  const quantity = Number(values.itemQuantity) || 0;
  const rate = Number(values.itemRate) || 0;
  const lineAmount = quantity * rate;

  return (
    <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex w-full items-center justify-between">
          <img
            src="/brand/simple-invoice-logo.png"
            alt="SimpleInvoice"
            className="h-10 w-auto"
          />

          <p className="flex flex-col items-end text-sm text-slate-500">
            <span className="px-2 py-1">Invoice Number</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
              {invoiceNumber}
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 border-b border-slate-200 py-6 text-sm md:grid-cols-2">
        <div>
          <p className="font-semibold text-slate-500">Billed By:</p>
          <p className="mt-3 font-bold text-slate-950">101 Digital PTE LTD</p>
          <p className="mt-1 leading-6 text-slate-600">
            Full Stack Engineering Assessment
            <br />
            Singapore
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-500">Billed To:</p>
          <p className="mt-3 font-bold text-slate-950">{customerName}</p>
          <p className="mt-1 leading-6 text-slate-600">{customerAddress}</p>
          <p className="mt-3 text-slate-600">Email: {customerEmail}</p>
          <p className="mt-1 text-slate-600">Mobile: {customerMobile}</p>
        </div>
      </div>

      <div className="grid gap-4 border-b border-slate-200 py-6 text-sm md:grid-cols-3">
        <PreviewMeta
          label="Invoice Date"
          value={formatPreviewDate(invoiceDate)}
        />
        <PreviewMeta label="Due Date" value={formatPreviewDate(dueDate)} />
        <PreviewMeta label="Currency" value={preview.currency.label} />
        <PreviewMeta label="Reference" value={values.invoiceReference || '-'} />
        <PreviewMeta label="Description" value={values.description || '-'} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Item Name</th>
              <th className="px-4 py-3 font-semibold">Qty</th>
              <th className="px-4 py-3 font-semibold">Rate</th>
              <th className="px-4 py-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="px-4 py-4">1</td>
              <td className="px-4 py-4 font-semibold text-slate-800">
                {itemName}
              </td>
              <td className="px-4 py-4">{quantity}</td>
              <td className="px-4 py-4">
                {formatPreviewMoney(rate, preview.currency.symbol)}
              </td>
              <td className="px-4 py-4 text-right font-semibold">
                {formatPreviewMoney(lineAmount, preview.currency.symbol)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ml-auto mt-6 max-w-sm space-y-3 text-sm">
        <SummaryLine
          label="Subtotal"
          value={formatPreviewMoney(preview.subtotal, preview.currency.symbol)}
        />

        <SummaryLine
          label={`Tax Amount (${Number(values.taxPercentage || 0)}%)`}
          value={formatPreviewMoney(preview.taxAmount, preview.currency.symbol)}
        />

        <SummaryLine
          label="Discount Amount"
          value={`-${formatPreviewMoney(
            preview.discount,
            preview.currency.symbol,
          )}`}
        />

        <SummaryLine
          label={`Total Amount (${preview.currency.code})`}
          value={formatPreviewMoney(
            preview.totalAmount,
            preview.currency.symbol,
          )}
          strong
          labelClassName="text-base"
          valueClassName="text-slate-950"
        />
      </div>
    </div>
  );
}

function SummaryLine({
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
      <span className={`${strong ? 'font-bold' : 'font-medium'} ${labelClassName}`}>
        {label}
      </span>
      <span
        className={`${strong ? 'text-xl font-bold' : 'font-semibold'} ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

function PreviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-slate-500">{label}</p>
      <p className="mt-2 font-bold text-slate-800">{value}</p>
    </div>
  );
}
