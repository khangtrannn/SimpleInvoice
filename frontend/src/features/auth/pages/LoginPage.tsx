export function LoginPage() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="text-lg font-semibold">SimpleInvoice</div>

        <div>
          <p className="mb-4 text-4xl font-semibold tracking-tight">
            Manage invoices with clarity.
          </p>
          <p className="max-w-md text-slate-300">
            A focused invoicing workspace for listing, reviewing, and creating invoices.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-500">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Sign in to SimpleInvoice
            </h1>
          </div>

          <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            Login form
          </div>
        </div>
      </section>
    </main>
  );
}