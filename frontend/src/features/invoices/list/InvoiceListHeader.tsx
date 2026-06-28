import { Receipt } from 'lucide-react';
import { Link } from 'react-router';

import { PageHeader } from '@/shared/ui/PageHeader';

export function InvoiceListHeader() {
  return (
    <PageHeader
      title="Invoices"
      subtitle="Create, manage and monitor all your invoices in one place."
      actions={
        <Link
          to="/invoices/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-black active:scale-[0.98]"
        >
          <Receipt className="h-4 w-4" aria-hidden="true" />
          Create Invoice
        </Link>
      }
    />
  );
}
