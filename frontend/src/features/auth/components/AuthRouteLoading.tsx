export function AuthRouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
        <div
          aria-hidden="true"
          className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950"
        />

        <p className="mt-4 text-sm font-semibold text-slate-900">
          Checking your session...
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Please wait while we restore your account.
        </p>
      </div>
    </div>
  );
}
