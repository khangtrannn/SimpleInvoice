import { Mail, MapPin, Phone, User } from 'lucide-react';

import type { InvoiceDetail } from '@/api/types';

import { DetailCard } from './DetailCard';
import { DetailInfoLine } from './DetailInfoLine';

type CustomerInformationCardProps = {
  invoice: InvoiceDetail;
};

export function CustomerInformationCard({ invoice }: CustomerInformationCardProps) {
  return (
    <DetailCard>
      <div className="mb-8 flex items-center gap-3">
        <SectionIcon>
          <User className="h-5 w-5" aria-hidden="true" />
        </SectionIcon>
        <h2 className="text-lg font-bold text-slate-950">Customer Information</h2>
      </div>

      <h3 className="text-xl font-bold text-slate-950">{invoice.customer.fullname}</h3>

      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <DetailInfoLine
          icon={<Mail className="h-5 w-5" />}
          value={invoice.customer.email}
        />

        <DetailInfoLine
          icon={<Phone className="h-5 w-5" />}
          value={invoice.customer.mobileNumber}
        />

        <DetailInfoLine
          icon={<MapPin className="h-5 w-5" />}
          value={invoice.customer.address}
        />
      </div>
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
