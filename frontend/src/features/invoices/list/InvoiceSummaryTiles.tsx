import { AlertCircle, ReceiptText, WalletCards } from 'lucide-react';

import type { TileSummary } from './invoice-summary.mapper';

interface InvoiceSummaryTilesProps {
  summary: TileSummary;
  isLoading?: boolean;
}

type TileAccent = 'neutral' | 'paid' | 'overdue';

const ACCENT_ICON_CLASSNAME: Record<TileAccent, string> = {
  neutral: 'bg-slate-50 text-slate-900',
  paid: 'bg-emerald-50 text-emerald-600',
  overdue: 'bg-red-50 text-red-600',
};

const ACCENT_VALUE_CLASSNAME: Record<TileAccent, string> = {
  neutral: 'text-slate-950',
  paid: 'text-slate-950',
  overdue: 'text-red-600',
};

export function InvoiceSummaryTiles({ summary, isLoading }: InvoiceSummaryTilesProps) {
  const tiles: {
    label: string;
    value: string | number;
    helper: string;
    icon: typeof ReceiptText;
    accent: TileAccent;
  }[] = [
    {
      label: 'Total Invoices',
      value: summary.totalInvoices,
      helper: summary.totalInvoicesHelper,
      icon: ReceiptText,
      accent: 'neutral',
    },
    {
      label: 'Outstanding Receivables',
      value: summary.outstanding,
      helper: summary.outstandingHelper,
      icon: WalletCards,
      accent: 'neutral',
    },
    {
      label: 'Paid Amount',
      value: summary.paid,
      helper: summary.paidHelper,
      icon: WalletCards,
      accent: 'paid',
    },
    {
      label: 'Overdue Amount',
      value: summary.overdue,
      helper: summary.overdueHelper,
      icon: AlertCircle,
      accent: 'overdue',
    },
  ];

  if (isLoading) {
    return (
      <section aria-label="Invoice summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <article
            key={idx}
            className="flex min-h-26 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
            </div>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section aria-label="Invoice summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <article
            key={tile.label}
            className="flex min-h-26 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ACCENT_ICON_CLASSNAME[tile.accent]}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-500">{tile.label}</p>
              <p className={`mt-1 text-2xl font-bold tabular-nums ${ACCENT_VALUE_CLASSNAME[tile.accent]}`}>
                {tile.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{tile.helper}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
