import { Calendar, Copy } from 'lucide-react';

import type { InvoiceDetail } from '@/api/types';
import { getInvoiceDetailViewModel } from '@/features/invoices/detail/invoice-detail.mapper';

import { DetailCard } from './DetailCard';

type InvoiceSummaryCardProps = {
  invoice: InvoiceDetail;
};

export function InvoiceSummaryCard({ invoice }: InvoiceSummaryCardProps) {
  const vm = getInvoiceDetailViewModel(invoice);

  return (
    <DetailCard>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <SummaryBlock label="Invoice Number">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-slate-950">{vm.invoiceNumber}</p>
            <button
              type="button"
              className="rounded-lg p-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Copy invoice number"
              onClick={() => navigator.clipboard?.writeText(invoice.invoiceNumber)}
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </SummaryBlock>

        <SummaryBlock label="Invoice Date">
          <div className="flex items-center gap-2 text-slate-800">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            <span className="font-semibold">{vm.invoiceDate}</span>
          </div>
        </SummaryBlock>

        <SummaryBlock label="Due Date">
          <div
            className={`flex items-center gap-2 ${
              invoice.status === 'Overdue' ? 'text-red-600' : 'text-slate-800'
            }`}
          >
            <Calendar className="h-5 w-5" aria-hidden="true" />
            <span className="font-semibold">{vm.dueDate}</span>
          </div>

          {invoice.status === 'Overdue' && vm.overdueDays > 0 ? (
            <p className="mt-2 text-sm font-semibold text-red-500">
              {vm.overdueDays} days overdue
            </p>
          ) : null}
        </SummaryBlock>

        <SummaryBlock label="Total Amount">
          <p className="text-xl font-bold text-slate-950">
            {vm.totalAmount}
          </p>
        </SummaryBlock>

        <SummaryBlock label="Outstanding Balance">
          <p
            className={`text-xl font-bold ${
              Number(invoice.balanceAmount) > 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {vm.balanceAmount}
          </p>
        </SummaryBlock>
      </div>
    </DetailCard>
  );
}

function SummaryBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-slate-200 lg:border-r lg:pr-6 lg:last:border-r-0">
      <p className="mb-3 text-sm font-semibold text-slate-500">{label}</p>
      {children}
    </div>
  );
}
