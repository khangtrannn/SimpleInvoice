import { Link, Outlet } from 'react-router';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/invoices" className="text-lg font-semibold text-slate-950">
            SimpleInvoice
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link className="font-medium text-slate-700 hover:text-slate-950" to="/invoices">
              Invoices
            </Link>

            <Link
              className="rounded-lg bg-slate-950 px-3 py-2 font-medium text-white hover:bg-slate-800"
              to="/invoices/new"
            >
              Create invoice
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}