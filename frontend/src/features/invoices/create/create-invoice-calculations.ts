import type { CurrencyCode } from '@/api/types';
import type { CreateInvoiceFormInput } from '@/features/invoices/schema/create-invoice.schema';

import {
  getCurrencyOption,
  type CurrencyOption,
} from './create-invoice.constants';

type InvoicePreviewSource = Pick<
  CreateInvoiceFormInput,
  'currency' | 'itemQuantity' | 'itemRate' | 'taxPercentage' | 'discount'
>;

export type InvoicePreviewTotals = {
  subtotal: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  currency: CurrencyOption;
};

export function calculateInvoicePreview(
  values: InvoicePreviewSource,
): InvoicePreviewTotals {
  const quantity = Number(values.itemQuantity) || 0;
  const rate = Number(values.itemRate) || 0;
  const taxPercentage = Number(values.taxPercentage) || 0;
  const discount = Number(values.discount) || 0;

  const subtotal = quantity * rate;
  const taxAmount = subtotal * (taxPercentage / 100);
  const totalAmount = subtotal + taxAmount - discount;
  const currency = getCurrencyOption(values.currency as CurrencyCode);

  return {
    subtotal,
    taxAmount,
    discount,
    totalAmount,
    currency,
  };
}
