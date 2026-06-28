import { ChevronLeft, Printer } from 'lucide-react';
import { Link } from 'react-router';

import type { InvoiceDetail } from '@/api/types';
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge';

type InvoiceDetailHeaderProps = {
  invoice: InvoiceDetail;
};

export function InvoiceDetailHeader({ invoice }: InvoiceDetailHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/invoices" className="font-medium hover:text-blue-600">
            Invoices
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">Invoice Details</span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Invoice Details
          </h1>

          <InvoiceStatusBadge status={invoice.status} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
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
      </div>
    </div>
  );
}
