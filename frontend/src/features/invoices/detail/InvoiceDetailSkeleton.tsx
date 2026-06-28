export function InvoiceDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-5 w-40 rounded-full bg-slate-200" />
        <div className="mt-5 h-9 w-64 rounded-full bg-slate-200" />
        <div className="mt-3 h-4 w-80 rounded-full bg-slate-100" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-5 w-36 rounded-full bg-slate-200" />
              <div className="mt-5 space-y-3">
                {Array.from({ length: 5 }, (_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="h-4 rounded-full bg-slate-100"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-5 w-36 rounded-full bg-slate-200" />
              <div className="mt-5 space-y-3">
                {Array.from({ length: 4 }, (_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="h-4 rounded-full bg-slate-100"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
