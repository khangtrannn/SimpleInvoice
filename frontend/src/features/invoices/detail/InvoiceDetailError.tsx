import { Link } from 'react-router';

type InvoiceDetailErrorProps = {
  title: string;
  message: string;
};

export function InvoiceDetailError({
  title,
  message,
}: InvoiceDetailErrorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <Link
        to="/invoices"
        className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        Back to invoices
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-slate-950">{title}</h1>

      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
}
