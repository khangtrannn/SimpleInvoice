import type { InvoiceListItem } from '@/api/types';
import { formatDate, formatLineAmount } from '@/shared/lib/format';

const CUSTOMER_AVATAR_COLORS = [
  'bg-slate-200 text-slate-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
] as const;

export type InvoiceDueDateMeta = {
  text: string;
  colorClassName: string;
};

export type InvoiceTableRowViewModel = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerInitials: string;
  customerAvatarClassName: string;
  invoiceDate: string;
  dueDate: string | null;
  dueDateMeta: InvoiceDueDateMeta | null;
  totalAmount: string;
  status: InvoiceListItem['status'];
  detailPath: string;
};

export function getInvoiceTableRowViewModel(
  invoice: InvoiceListItem,
  today = new Date(),
): InvoiceTableRowViewModel {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    customerInitials: getCustomerInitials(invoice.customerName),
    customerAvatarClassName: getCustomerAvatarClassName(invoice.customerName),
    invoiceDate: formatDate(invoice.invoiceDate),
    dueDate: invoice.dueDate ? formatDate(invoice.dueDate) : null,
    dueDateMeta: getInvoiceDueDateMeta(invoice.dueDate, today),
    totalAmount: formatLineAmount(invoice.totalAmount, invoice.currencySymbol),
    status: invoice.status,
    detailPath: `/invoices/${invoice.id}`,
  };
}

export function getCustomerInitials(name: string): string {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return '?';
  }

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
}

export function getCustomerAvatarClassName(name: string): string {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return CUSTOMER_AVATAR_COLORS[0];
  }

  let hash = 0;

  for (let index = 0; index < normalizedName.length; index += 1) {
    hash = (hash * 31 + normalizedName.charCodeAt(index)) & 0xffff;
  }

  return CUSTOMER_AVATAR_COLORS[hash % CUSTOMER_AVATAR_COLORS.length];
}

export function getInvoiceDueDateMeta(
  dueDate: string | undefined | null,
  today = new Date(),
): InvoiceDueDateMeta | null {
  if (!dueDate) {
    return null;
  }

  const normalizedToday = new Date(today);
  normalizedToday.setHours(0, 0, 0, 0);

  const due = new Date(`${dueDate}T00:00:00`);
  const days = Math.round(
    (due.getTime() - normalizedToday.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (days < 0) {
    return {
      text: `${Math.abs(days)} days overdue`,
      colorClassName: 'text-red-500',
    };
  }

  if (days === 0) {
    return {
      text: 'Due today',
      colorClassName: 'text-amber-600',
    };
  }

  if (days <= 7) {
    return {
      text: `${days} days left`,
      colorClassName: 'text-amber-500',
    };
  }

  return {
    text: `${days} days left`,
    colorClassName: 'text-slate-400',
  };
}
