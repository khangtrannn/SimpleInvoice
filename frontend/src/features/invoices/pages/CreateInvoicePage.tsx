import { Link } from 'react-router';

export function CreateInvoicePage() {
  return (
    <div>
      <div className="mb-8">
        <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" to="/invoices">
          ← Back to invoices
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Create invoice
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          New invoices will be created as Draft and totals will be calculated by the backend.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Create invoice form
        </p>
      </div>
    </div>
  );
}