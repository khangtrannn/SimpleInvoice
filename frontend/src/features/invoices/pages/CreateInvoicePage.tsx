import { zodResolver } from "@hookform/resolvers/zod";
import { Box, ChevronDown, ChevronLeft, FileText, Send, User } from "lucide-react";
import { useMemo } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import type { CreateInvoiceRequest, CurrencyCode } from "@/api/types";
import { useCreateInvoice } from "@/features/invoices/hooks/use-create-invoice";
import {
  createInvoiceSchema,
  type CreateInvoiceFormInput,
  type CreateInvoiceFormValues,
} from "@/features/invoices/schema/create-invoice.schema";
import { getApiErrorMessage } from "@/utils/api-error";

const CURRENCY_OPTIONS: Array<{
  code: CurrencyCode;
  label: string;
  symbol: string;
}> = [
  {
    code: "AUD",
    label: "AUD - Australian Dollar",
    symbol: "AU$",
  },
  {
    code: "USD",
    label: "USD - US Dollar",
    symbol: "US$",
  },
  {
    code: "GBP",
    label: "GBP - British Pound",
    symbol: "£",
  },
];

export function CreateInvoicePage() {
  const navigate = useNavigate();
  const createInvoiceMutation = useCreateInvoice();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateInvoiceFormInput, unknown, CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerMobile: "",
      customerAddress: "",
      invoiceNumber: getDefaultInvoiceNumber(),
      invoiceDate: getDateInputValue(),
      dueDate: getDateInputValue(14),
      currency: "AUD",
      invoiceReference: "",
      description: "",
      itemName: "",
      itemQuantity: 1,
      itemRate: 0,
      taxPercentage: 10,
      discount: 0,
    },
  });

  const watchedValues = watch();

  const preview = useMemo(() => {
    const quantity = Number(watchedValues.itemQuantity) || 0;
    const rate = Number(watchedValues.itemRate) || 0;
    const taxPercentage = Number(watchedValues.taxPercentage) || 0;
    const discount = Number(watchedValues.discount) || 0;
    const subtotal = quantity * rate;
    const taxAmount = subtotal * (taxPercentage / 100);
    const totalAmount = subtotal + taxAmount - discount;
    const currency = getCurrencyOption(watchedValues.currency);

    return {
      subtotal,
      taxAmount,
      discount,
      totalAmount,
      currency,
    };
  }, [
    watchedValues.currency,
    watchedValues.discount,
    watchedValues.itemQuantity,
    watchedValues.itemRate,
    watchedValues.taxPercentage,
  ]);

  function onSubmit(values: CreateInvoiceFormValues) {
    const payload = mapFormToPayload(values);

    createInvoiceMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Invoice created successfully.");
        navigate("/invoices", { replace: true });
      },
      onError: (error) => {
        const message = getApiErrorMessage(error, "Failed to create invoice.");

        if (message.toLowerCase().includes("invoice number")) {
          setError("invoiceNumber", {
            type: "server",
            message,
          });
        }

        toast.error(message);
      },
    });
  }

  const isSubmitting = createInvoiceMutation.isPending;

  return (
    <div>
      <form
        id="create-invoice-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link to="/invoices" className="font-medium hover:text-blue-600">
                Invoices
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-700">
                Create Invoice
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              Create Invoice
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create a new invoice and deliver it instantly.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black disabled:bg-slate-400"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {isSubmitting ? "Creating..." : "Create Invoice"}
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

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.9fr]">
          <div className="space-y-5">
            <FormCard
              icon={<User className="h-5 w-5" />}
              title="Customer Information"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Customer Name"
                  requiredMark
                  placeholder="e.g. Acme Corporation"
                  error={errors.customerName?.message}
                  {...register("customerName")}
                />

                <TextInput
                  label="Customer Email"
                  requiredMark
                  type="email"
                  placeholder="name@example.com"
                  error={errors.customerEmail?.message}
                  {...register("customerEmail")}
                />

                <TextInput
                  label="Customer Mobile"
                  placeholder="e.g. +61 400 123 456"
                  error={errors.customerMobile?.message}
                  {...register("customerMobile")}
                />

                <TextInput
                  label="Customer Address"
                  placeholder="e.g. 123 Market St, Sydney, NSW 2000"
                  error={errors.customerAddress?.message}
                  {...register("customerAddress")}
                />
              </div>
            </FormCard>

            <FormCard
              icon={<FileText className="h-5 w-5" />}
              title="Invoice Information"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <TextInput
                  label="Invoice Number"
                  requiredMark
                  placeholder="INV-2026-009"
                  error={errors.invoiceNumber?.message}
                  {...register("invoiceNumber")}
                />

                <TextInput
                  label="Invoice Date"
                  requiredMark
                  type="date"
                  error={errors.invoiceDate?.message}
                  {...register("invoiceDate")}
                />

                <TextInput
                  label="Due Date"
                  requiredMark
                  type="date"
                  error={errors.dueDate?.message}
                  {...register("dueDate")}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <SelectInput
                  label="Currency"
                  requiredMark
                  error={errors.currency?.message}
                  {...register("currency")}
                >
                  {CURRENCY_OPTIONS.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.label}
                    </option>
                  ))}
                </SelectInput>

                <TextInput
                  label="Invoice Reference"
                  placeholder="e.g. PO #1234"
                  error={errors.invoiceReference?.message}
                  {...register("invoiceReference")}
                />
              </div>

              <div className="mt-4">
                <TextareaInput
                  label="Description"
                  placeholder="e.g. Services provided in May 2026"
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>
            </FormCard>

            <FormCard icon={<Box className="h-5 w-5" />} title="Invoice Item">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-[1.5fr_0.7fr_1fr_0.8fr_1fr] md:items-start">
                <div className="col-span-2 md:col-span-1">
                  <TextInput
                    label="Item Name"
                    requiredMark
                    placeholder="Website Design"
                    error={errors.itemName?.message}
                    {...register("itemName")}
                  />
                </div>

                <TextInput
                  label="Quantity"
                  requiredMark
                  type="number"
                  min={1}
                  step={1}
                  error={errors.itemQuantity?.message}
                  {...register("itemQuantity")}
                />

                <TextInput
                  label={`Rate (${watchedValues.currency})`}
                  requiredMark
                  type="number"
                  min={0}
                  step="0.01"
                  error={errors.itemRate?.message}
                  {...register("itemRate")}
                />

                <TextInput
                  label="Tax (%)"
                  type="number"
                  min={0}
                  step="0.01"
                  error={errors.taxPercentage?.message}
                  {...register("taxPercentage")}
                />

                <TextInput
                  label={`Discount (${watchedValues.currency})`}
                  type="number"
                  min={0}
                  step="0.01"
                  error={errors.discount?.message}
                  {...register("discount")}
                />
              </div>
            </FormCard>

          </div>

          <div>
            <InvoicePreview values={watchedValues} preview={preview} />
          </div>
        </div>
      </form>
    </div>
  );
}

function InvoicePreview({
  values,
  preview,
}: {
  values: CreateInvoiceFormInput;
  preview: {
    subtotal: number;
    taxAmount: number;
    discount: number;
    totalAmount: number;
    currency: {
      code: CurrencyCode;
      label: string;
      symbol: string;
    };
  };
}) {
  const customerName = values.customerName || "Customer Name";
  const customerEmail = values.customerEmail || "customer@example.com";
  const customerMobile = values.customerMobile || "+61 400 123 456";
  const customerAddress = values.customerAddress || "Customer address";
  const invoiceNumber = values.invoiceNumber || "INV-0000";
  const invoiceDate = values.invoiceDate || getDateInputValue();
  const dueDate = values.dueDate || getDateInputValue(14);
  const itemName = values.itemName || "Item name";
  const quantity = Number(values.itemQuantity) || 0;
  const rate = Number(values.itemRate) || 0;
  const lineAmount = quantity * rate;

  return (
      <div className="rounded-xl h-fit bg-white p-6 shadow-[0_16px_60px_rgba(15,23,42,0.10)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="w-full flex justify-between items-center">
            <img
              src="/brand/simple-invoice-logo.png"
              alt="SimpleInvoice"
              className="h-10 w-auto"
            />
            <p className="flex flex-col items-end text-sm text-slate-500">
              <span className="px-2 py-1">
                Invoice Number
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                {invoiceNumber}
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 border-b border-slate-200 py-6 text-sm md:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-500">Billed By:</p>
            <p className="mt-3 font-bold text-slate-950">SimpleInvoice</p>
            <p className="mt-1 leading-6 text-slate-600">
              Secure invoicing workspace
              <br />
              Australia
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
          <PreviewMeta
            label="Reference"
            value={values.invoiceReference || "-"}
          />
          <PreviewMeta label="Description" value={values.description || "-"} />
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
            value={formatPreviewMoney(
              preview.subtotal,
              preview.currency.symbol,
            )}
          />
          <SummaryLine
            label={`Tax Amount (${Number(values.taxPercentage || 0)}%)`}
            value={formatPreviewMoney(
              preview.taxAmount,
              preview.currency.symbol,
            )}
          />
          <SummaryLine
            label="Discount Amount"
            value={`-${formatPreviewMoney(preview.discount, preview.currency.symbol)}`}
          />

          <SummaryLine
            label={`Total Amount (${preview.currency.code})`}
            value={formatPreviewMoney(
              preview.totalAmount,
              preview.currency.symbol,
            )}
            strong
            labelClassName="text-base"
            valueClassName="text-blue-600"
          />
        </div>
      </div>
  );
}

function FormCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
          {icon}
        </span>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>

      {children}
    </section>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  requiredMark?: boolean;
};

function TextInput({
  label,
  error,
  requiredMark,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-500">
        {label}
        {requiredMark ? <span className="text-red-500"> *</span> : null}
      </span>

      <input
        className={`h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  requiredMark?: boolean;
  children: ReactNode;
};

function SelectInput({
  label,
  error,
  requiredMark,
  children,
  className = "",
  ...props
}: SelectInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-500">
        {label}
        {requiredMark ? <span className="text-red-500"> *</span> : null}
      </span>

      <div className="relative">
        <select
          className={`h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
          {...props}
        >
          {children}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  requiredMark?: boolean;
};

function TextareaInput({
  label,
  error,
  requiredMark,
  className = "",
  ...props
}: TextareaInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-500">
        {label}
        {requiredMark ? <span className="text-red-500"> *</span> : null}
      </span>

      <textarea
        rows={3}
        className={`w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

function SummaryLine({
  label,
  value,
  strong = false,
  labelClassName = "text-slate-700",
  valueClassName = "text-slate-900",
}: {
  label: string;
  value: string;
  strong?: boolean;
  labelClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span
        className={`${strong ? "font-bold" : "font-medium"} ${labelClassName}`}
      >
        {label}
      </span>
      <span
        className={`${strong ? "text-xl font-bold" : "font-semibold"} ${valueClassName}`}
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

function mapFormToPayload(
  values: CreateInvoiceFormValues,
): CreateInvoiceRequest {
  return {
    customerName: values.customerName.trim(),
    customerEmail: values.customerEmail.trim(),
    customerMobile: normalizeOptionalString(values.customerMobile),
    customerAddress: normalizeOptionalString(values.customerAddress),
    invoiceNumber: values.invoiceNumber.trim(),
    invoiceReference: normalizeOptionalString(values.invoiceReference),
    invoiceDate: values.invoiceDate,
    dueDate: values.dueDate,
    currency: values.currency,
    description: normalizeOptionalString(values.description),
    item: {
      name: values.itemName.trim(),
      quantity: values.itemQuantity,
      rate: values.itemRate,
    },
    taxPercentage: values.taxPercentage,
    discount: values.discount,
  };
}

function normalizeOptionalString(value: string | undefined) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : undefined;
}

function getCurrencyOption(currencyCode: CurrencyCode) {
  return (
    CURRENCY_OPTIONS.find((currency) => currency.code === currencyCode) ??
    CURRENCY_OPTIONS[0]
  );
}

function getDateInputValue(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);

  return date.toISOString().slice(0, 10);
}

function getDefaultInvoiceNumber() {
  const year = new Date().getFullYear();
  const suffix = String(Date.now()).slice(-6);

  return `INV-${year}-${suffix}`;
}

function formatPreviewMoney(amount: number, currencySymbol: string) {
  return `${currencySymbol}${new Intl.NumberFormat("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

function formatPreviewDate(dateValue: string) {
  if (!dateValue) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
}
