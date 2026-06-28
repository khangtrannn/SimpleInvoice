import { FileText } from 'lucide-react';

import type { InvoiceDetail } from '@/api/types';
import { getInvoiceDetailViewModel } from '@/features/invoices/detail/invoice-detail.mapper';
import { SectionCard } from '@/shared/ui/SectionCard';

type InvoiceInformationCardProps = {
  invoice: InvoiceDetail;
};

export function InvoiceInformationCard({ invoice }: InvoiceInformationCardProps) {
  const vm = getInvoiceDetailViewModel(invoice);

  return (
    <SectionCard icon={<FileText className="h-5 w-5" aria-hidden="true" />} title="Invoice Information">
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
    </SectionCard>
  );
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return <dt className="font-semibold text-slate-500">{children}</dt>;
}

function DetailValue({ children }: { children: React.ReactNode }) {
  return <dd className="font-semibold text-slate-800">{children}</dd>;
}
