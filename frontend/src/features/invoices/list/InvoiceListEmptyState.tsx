import { FileSearch, Plus } from 'lucide-react';
import { Link } from 'react-router';

export function InvoiceListEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100">
        <FileSearch className="h-7 w-7 text-slate-400" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-slate-900">No invoices found</h2>
      <p className="mt-1.5 max-w-xs text-sm text-slate-500">
        Try changing your search or filters, or create your first invoice.
      </p>
      <Link
        to="/invoices/new"
        className="mt-6 inline-flex h-9 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-md shadow-slate-950/20 transition hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Create Invoice
      </Link>
    </div>
  );
}
