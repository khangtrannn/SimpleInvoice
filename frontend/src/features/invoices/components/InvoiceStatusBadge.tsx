import type { InvoiceStatus } from '@/api/types';

const statusConfig: Record<InvoiceStatus, { badge: string; dot: string }> = {
  Draft: { badge: 'bg-white text-slate-700 ring-1 ring-slate-300', dot: 'bg-slate-500' },
  Pending: { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', dot: 'bg-amber-400' },
  Paid: { badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  Overdue: { badge: 'bg-red-50 text-red-700 ring-1 ring-red-200', dot: 'bg-red-500' },
};

type InvoiceStatusBadgeProps = {
  status: InvoiceStatus;
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
