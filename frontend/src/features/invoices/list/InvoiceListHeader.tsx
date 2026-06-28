import { Plus } from 'lucide-react';
import { Link } from 'react-router';

export function InvoiceListHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Invoices</h1>
        <p className="mt-2 text-sm text-slate-500">
          Create, manage and monitor all your invoices in one place.
        </p>
      </div>

      <Link
        to="/invoices/new"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create Invoice
      </Link>
    </div>
  );
}
