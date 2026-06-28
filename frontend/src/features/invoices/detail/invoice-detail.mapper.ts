import type { InvoiceDetail } from '@/api/types';
import {
  formatDate,
  formatDateTime,
  formatLineAmount,
  formatMoney,
  getDaysOverdue,
} from '@/shared/lib/format';

export type InvoiceDetailViewModel = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  createdAt: string;
  totalAmount: string;
  balanceAmount: string;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  totalPaid: string;
  overdueDays: number;
  isOverdue: boolean;
  hasReference: boolean;
  hasDescription: boolean;
  reference: string | null;
  description: string | null;
  currencyLabel: string;
  printStatusValue: string;
};

export function getInvoiceDetailViewModel(
  invoice: InvoiceDetail,
): InvoiceDetailViewModel {
  const overdueDays =
    invoice.status === 'Overdue' ? getDaysOverdue(invoice.dueDate) : 0;

  return {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: formatDate(invoice.invoiceDate),
    dueDate: formatDate(invoice.dueDate),
    createdAt: formatDateTime(invoice.createdAt),
    totalAmount: formatMoney(
      invoice.totalAmount,
      invoice.currency,
      invoice.currencySymbol,
    ),
    balanceAmount: formatMoney(
      invoice.balanceAmount,
      invoice.currency,
      invoice.currencySymbol,
    ),
    subtotal: formatLineAmount(invoice.invoiceSubTotal, invoice.currencySymbol),
    taxAmount: formatLineAmount(invoice.totalTax, invoice.currencySymbol),
    discountAmount: formatLineAmount(
      invoice.totalDiscount,
      invoice.currencySymbol,
    ),
    totalPaid: formatLineAmount(invoice.totalPaid, invoice.currencySymbol),
    overdueDays,
    isOverdue: invoice.status === 'Overdue' && overdueDays > 0,
    hasReference: hasContent(invoice.invoiceReference),
    hasDescription: hasContent(invoice.description),
    reference: invoice.invoiceReference,
    description: invoice.description,
    currencyLabel: getCurrencyLabel(invoice.currency),
    printStatusValue: getPrintStatusValue(invoice),
  };
}

export function getInvoiceItemLineTotal(
  invoice: Pick<InvoiceDetail, 'currencySymbol'>,
  item: InvoiceDetail['items'][number],
) {
  return formatLineAmount(Number(item.rate) * item.quantity, invoice.currencySymbol);
}

export function getFormattedInvoiceItemRate(
  invoice: Pick<InvoiceDetail, 'currencySymbol'>,
  item: InvoiceDetail['items'][number],
) {
  return formatLineAmount(item.rate, invoice.currencySymbol);
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

function getPrintStatusValue(invoice: InvoiceDetail) {
  if (invoice.status === 'Paid') {
    return 'Paid in full';
  }

  if (invoice.status === 'Overdue' || invoice.status === 'Pending') {
    return formatLineAmount(invoice.balanceAmount, invoice.currencySymbol);
  }

  return 'Not issued';
}
