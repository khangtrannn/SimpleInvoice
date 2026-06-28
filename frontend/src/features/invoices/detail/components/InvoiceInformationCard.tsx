import { FileText } from 'lucide-react';

import type { InvoiceDetail } from '@/api/types';
import { getInvoiceDetailViewModel } from '@/features/invoices/detail/invoice-detail.mapper';

import { DetailCard } from './DetailCard';

type InvoiceInformationCardProps = {
  invoice: InvoiceDetail;
};

export function InvoiceInformationCard({ invoice }: InvoiceInformationCardProps) {
  const vm = getInvoiceDetailViewModel(invoice);

  return (
    <DetailCard>
      <div className="mb-8 flex items-center gap-3">
        <SectionIcon>
          <FileText className="h-5 w-5" aria-hidden="true" />
        </SectionIcon>
        <h2 className="text-lg font-bold text-slate-950">Invoice Information</h2>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-[180px_1fr]">
        {vm.hasReference ? (
          <>
            <DetailLabel>Reference</DetailLabel>
            <DetailValue>{vm.reference}</DetailValue>
          </>
        ) : null}

        <DetailLabel>Currency</DetailLabel>
        <DetailValue>
          {invoice.currency} {invoice.currencySymbol ? `(${invoice.currencySymbol})` : ''}
        </DetailValue>

        <DetailLabel>Created On</DetailLabel>
        <DetailValue>{vm.createdAt}</DetailValue>

        {vm.hasDescription ? (
          <>
            <DetailLabel>Description</DetailLabel>
            <DetailValue>{vm.description}</DetailValue>
          </>
        ) : null}
      </dl>
    </DetailCard>
  );
}

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
      {children}
    </span>
  );
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return <dt className="font-semibold text-slate-500">{children}</dt>;
}

function DetailValue({ children }: { children: React.ReactNode }) {
  return <dd className="font-semibold text-slate-800">{children}</dd>;
}
