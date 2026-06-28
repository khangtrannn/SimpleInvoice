import type { InvoiceStatus } from '@/api/types';
import { getInvoiceStatusConfig } from '@/features/invoices/model/invoice-status';

type InvoiceStatusBadgeProps = {
  status: InvoiceStatus;
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const config = getInvoiceStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.badgeClassName}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
