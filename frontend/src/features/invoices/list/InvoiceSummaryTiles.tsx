import { AlertCircle, Clock3, FileText, ReceiptText, WalletCards } from 'lucide-react';

import type { TileSummary } from './invoice-summary.mapper';

export function InvoiceSummaryTiles({ summary }: { summary: TileSummary }) {
  const tiles = [
    {
      label: 'Total Revenue',
      value: summary.total,
      helper: summary.totalHelper,
      icon: ReceiptText,
    },
    {
      label: 'Paid',
      value: summary.paid,
      helper: summary.paidHelper,
      icon: WalletCards,
    },
    {
      label: 'Pending',
      value: summary.pending,
      helper: summary.pendingHelper,
      icon: Clock3,
    },
    {
      label: 'Overdue',
      value: summary.overdue,
      helper: summary.overdueHelper,
      icon: AlertCircle,
    },
    {
      label: 'Draft',
      value: summary.draft,
      helper: summary.draftHelper,
      icon: FileText,
    },
  ];

  return (
    <section aria-label="Invoice summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {tiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <article
            key={tile.label}
            className="flex min-h-28 items-center gap-5 rounded-lg border border-slate-200 bg-white px-6 py-5 shadow-sm"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-900">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600">{tile.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{tile.value}</p>
              <p className="mt-1 text-xs text-slate-500">{tile.helper}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
