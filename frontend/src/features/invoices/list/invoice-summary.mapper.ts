import type { InvoiceSummary } from '@/api/types';
import { formatLineAmount } from '@/shared/lib/format';

export type TileSummary = {
  total: string;
  paid: string;
  pending: string;
  overdue: string;
  draft: string;
  draftCount: number;
  totalHelper: string;
  paidHelper: string;
  pendingHelper: string;
  overdueHelper: string;
  draftHelper: string;
};

export function buildTileSummary(summary: InvoiceSummary | null): TileSummary {
  const draftCount = summary?.draftCount ?? 0;

  const totalRevenue = Number(summary?.totalRevenue ?? 0);
  const totalPaid = Number(summary?.totalPaid ?? 0);
  const totalPending = Number(summary?.totalPending ?? 0);
  const totalOverdue = Number(summary?.totalOverdue ?? 0);
  const totalDraft = Number(summary?.totalDraft ?? 0);

  const pct = (val: number) =>
    totalRevenue > 0 ? `${Math.round((val / totalRevenue) * 100)}% of total` : '—';

  return {
    total: formatLineAmount(totalRevenue, ''),
    paid: formatLineAmount(totalPaid, ''),
    pending: formatLineAmount(totalPending, ''),
    overdue: formatLineAmount(totalOverdue, ''),
    draft: formatLineAmount(totalDraft, ''),
    draftCount,
    totalHelper: 'Total revenue',
    paidHelper: pct(totalPaid),
    pendingHelper: pct(totalPending),
    overdueHelper: pct(totalOverdue),
    draftHelper: `${draftCount} invoice${draftCount !== 1 ? 's' : ''}`,
  };
}
