import type { InvoiceSummary } from '@/api/types';
import { formatLineAmount } from '@/shared/lib/format';

export type TileSummary = {
  totalInvoices: number;
  totalInvoicesHelper: string;
  outstanding: string;
  outstandingHelper: string;
  paid: string;
  paidHelper: string;
  overdue: string;
  overdueHelper: string;
};

export function buildTileSummary(summary: InvoiceSummary | null): TileSummary {
  const paidCount = summary?.paidCount ?? 0;
  const pendingCount = summary?.pendingCount ?? 0;
  const overdueCount = summary?.overdueCount ?? 0;
  const draftCount = summary?.draftCount ?? 0;

  const totalPaid = Number(summary?.totalPaid ?? 0);
  const totalPending = Number(summary?.totalPending ?? 0);
  const totalOverdue = Number(summary?.totalOverdue ?? 0);

  const totalInvoices = paidCount + pendingCount + overdueCount + draftCount;
  const outstandingAmount = totalPending + totalOverdue;
  const unpaidCount = pendingCount + overdueCount;

  return {
    totalInvoices,
    totalInvoicesHelper: `${draftCount} draft${draftCount !== 1 ? 's' : ''}`,
    outstanding: formatLineAmount(outstandingAmount, ''),
    outstandingHelper: `${unpaidCount} invoice${unpaidCount !== 1 ? 's' : ''} unpaid`,
    paid: formatLineAmount(totalPaid, ''),
    paidHelper: `${paidCount} invoice${paidCount !== 1 ? 's' : ''} paid`,
    overdue: formatLineAmount(totalOverdue, ''),
    overdueHelper: `${overdueCount} invoice${overdueCount !== 1 ? 's' : ''} overdue`,
  };
}
