import { ChevronLeft, Printer } from 'lucide-react';
import { Link } from 'react-router';

import type { InvoiceDetail } from '@/api/types';
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge';
import { PageHeader } from '@/shared/ui/PageHeader';

type InvoiceDetailHeaderProps = {
  invoice: InvoiceDetail;
};

export function InvoiceDetailHeader({ invoice }: InvoiceDetailHeaderProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <PageHeader
        breadcrumb={[{ label: 'Invoices', to: '/invoices' }, { label: 'Invoice Details' }]}
        title="Invoice Details"
        badge={<InvoiceStatusBadge status={invoice.status} />}
        actions={
          <>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print Invoice
            </button>

            <Link
              to="/invoices"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back to Invoices
            </Link>
          </>
        }
      />
    </div>
  );
}
