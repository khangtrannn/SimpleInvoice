export function InvoiceListPage() {
  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">Overview</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
            Invoices
          </h1>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Invoice list
        </p>
      </div>
    </div>
  );
}