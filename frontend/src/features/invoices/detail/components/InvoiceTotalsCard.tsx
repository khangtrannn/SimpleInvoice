import type { InvoiceDetail } from '@/api/types';
import { getInvoiceDetailViewModel } from '@/features/invoices/detail/invoice-detail.mapper';
import { SectionCard } from '@/shared/ui/SectionCard';

type InvoiceTotalsCardProps = {
  invoice: InvoiceDetail;
};

export function InvoiceTotalsCard({ invoice }: InvoiceTotalsCardProps) {
  const vm = getInvoiceDetailViewModel(invoice);
  const hasBalance = Number(invoice.balanceAmount) > 0;

  return (
    <SectionCard title="Amount Summary">
      <div className="space-y-4 text-sm">
        <TotalLine
          label="Subtotal"
          value={vm.subtotal}
        />
        <TotalLine
          label={`Tax (${Number(invoice.taxPercentage).toFixed(0)}%)`}
          value={vm.taxAmount}
        />
        <TotalLine
          label="Discount"
          value={vm.discountAmount}
        />

        <div className="border-t border-slate-200 pt-4">
          <TotalLine
            label="Total Invoice Amount"
            value={vm.totalAmount}
            strong
          />
        </div>

        <TotalLine
          label="Total Paid"
          value={vm.totalPaid}
        />

        {hasBalance ? (
          <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
            <TotalLine
              label="Outstanding Balance"
              value={vm.balanceAmount}
              strong
              labelClassName="text-red-600"
              valueClassName="text-red-600"
            />
            <p className="mt-2 text-xs font-medium text-red-500/80">
              Paid {vm.totalPaid} of {vm.totalAmount}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
            <TotalLine
              label="Outstanding Balance"
              value={vm.balanceAmount}
              strong
              labelClassName="text-emerald-600"
              valueClassName="text-emerald-600"
            />
          </div>
        )}
      </div>
    </SectionCard>
  );
}

function TotalLine({
  label,
  value,
  strong = false,
  labelClassName = 'text-slate-700',
  valueClassName = 'text-slate-900',
}: {
  label: string;
  value: string;
  strong?: boolean;
  labelClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className={`${strong ? 'font-bold' : 'font-medium'} ${labelClassName}`}>{label}</span>
      <span className={`${strong ? 'text-lg font-bold' : 'font-semibold'} ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}
