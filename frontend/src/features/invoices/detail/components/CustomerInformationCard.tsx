import { Mail, MapPin, Phone, User } from 'lucide-react';

import type { InvoiceDetail } from '@/api/types';
import { SectionCard } from '@/shared/ui/SectionCard';

import { DetailInfoLine } from './DetailInfoLine';

type CustomerInformationCardProps = {
  invoice: InvoiceDetail;
};

export function CustomerInformationCard({ invoice }: CustomerInformationCardProps) {
  return (
    <SectionCard icon={<User className="h-5 w-5" aria-hidden="true" />} title="Customer Information">
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
    </SectionCard>
  );
}
