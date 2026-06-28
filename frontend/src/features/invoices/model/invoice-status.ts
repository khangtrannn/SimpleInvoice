import type { InvoiceStatus } from '@/api/types';

export type InvoiceStatusConfig = {
  label: InvoiceStatus;
  badgeClassName: string;
  dotClassName: string;
};

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, InvoiceStatusConfig> = {
  Draft: {
    label: 'Draft',
    badgeClassName: 'bg-white text-slate-700 ring-1 ring-slate-300',
    dotClassName: 'bg-slate-500',
  },
  Pending: {
    label: 'Pending',
    badgeClassName: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dotClassName: 'bg-amber-400',
  },
  Paid: {
    label: 'Paid',
    badgeClassName: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dotClassName: 'bg-emerald-500',
  },
  Overdue: {
    label: 'Overdue',
    badgeClassName: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    dotClassName: 'bg-red-500',
  },
};

export function getInvoiceStatusConfig(
  status: InvoiceStatus,
): InvoiceStatusConfig {
  return INVOICE_STATUS_CONFIG[status];
}
