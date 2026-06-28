import type { CreateInvoiceFormInput } from '@/features/invoices/schema/create-invoice.schema';

import { DEFAULT_CURRENCY } from './create-invoice.constants';

export function getCreateInvoiceDefaultValues(): CreateInvoiceFormInput {
  return {
    customerName: '',
    customerEmail: '',
    customerMobile: '',
    customerAddress: '',
    invoiceNumber: getDefaultInvoiceNumber(),
    invoiceDate: getDateInputValue(),
    dueDate: getDateInputValue(14),
    currency: DEFAULT_CURRENCY,
    invoiceReference: '',
    description: '',
    itemName: '',
    itemQuantity: 1,
    itemRate: 0,
    taxPercentage: 10,
    discount: 0,
  };
}

export function getDateInputValue(offsetDays = 0) {
  const date = new Date();

  date.setDate(date.getDate() + offsetDays);

  return date.toISOString().slice(0, 10);
}

function getDefaultInvoiceNumber() {
  const year = new Date().getFullYear();
  const suffix = String(Date.now()).slice(-6);

  return `INV-${year}-${suffix}`;
}
