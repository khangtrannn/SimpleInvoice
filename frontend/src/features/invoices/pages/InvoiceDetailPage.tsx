import { Link, useParams } from 'react-router';

export function InvoiceDetailPage() {
  const { invoiceId } = useParams();

  return (
    <div>
      <div className="mb-8">
        <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" to="/invoices">
          ← Back to invoices
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          Invoice detail
        </h1>

        <p className="mt-2 text-sm text-slate-500">Invoice ID: {invoiceId}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Invoice Details
        </p>
      </div>
    </div>
  );
}