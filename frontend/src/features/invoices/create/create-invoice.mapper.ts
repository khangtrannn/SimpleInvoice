import type { CreateInvoiceRequest } from '@/api/types';
import type { CreateInvoiceFormValues } from '@/features/invoices/schema/create-invoice.schema';

export function mapCreateInvoiceFormToPayload(
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
