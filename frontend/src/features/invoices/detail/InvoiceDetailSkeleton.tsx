export function InvoiceDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="h-4 w-40 rounded-full bg-slate-100" />
            <div className="mt-4 flex items-center gap-3">
              <div className="h-8 w-48 rounded-full bg-slate-200" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-11 w-40 rounded-xl bg-slate-200" />
            <div className="h-11 w-44 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="space-y-3 border-slate-200 lg:border-r lg:pr-6 lg:last:border-r-0 lg:last:pr-0"
            >
              <div className="h-3 w-20 rounded-full bg-slate-100" />
              <div className="h-6 w-28 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Customer / Invoice information */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100" />
            <div className="h-5 w-44 rounded-full bg-slate-200" />
          </div>

          <div className="h-5 w-40 rounded-full bg-slate-200" />

          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-slate-100" />
                <div className="h-4 w-48 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100" />
            <div className="h-5 w-44 rounded-full bg-slate-200" />
          </div>

          <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="contents">
                <div className="h-4 w-24 rounded-full bg-slate-100" />
                <div className="h-4 w-40 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Items / Totals */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 h-5 w-32 rounded-full bg-slate-200" />

          <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
            <div className="grid grid-cols-5 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="h-3 rounded-full bg-slate-200" />
              ))}
            </div>

            <div className="divide-y divide-slate-100">
              {Array.from({ length: 4 }, (_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-4 px-6 py-4">
                  {Array.from({ length: 5 }, (_, colIndex) => (
                    <div key={colIndex} className="h-4 rounded-full bg-slate-100" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 md:hidden">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="h-3 w-16 rounded-full bg-slate-100" />
                    <div className="h-4 w-32 rounded-full bg-slate-200" />
                  </div>
                  <div className="h-4 w-16 rounded-full bg-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="h-3 w-12 rounded-full bg-slate-100" />
                    <div className="h-4 w-16 rounded-full bg-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-12 rounded-full bg-slate-100" />
                    <div className="h-4 w-16 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 h-5 w-36 rounded-full bg-slate-200" />

          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="h-4 w-20 rounded-full bg-slate-100" />
                <div className="h-4 w-16 rounded-full bg-slate-100" />
              </div>
            ))}

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between gap-6">
                <div className="h-4 w-36 rounded-full bg-slate-200" />
                <div className="h-5 w-24 rounded-full bg-slate-200" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-6">
              <div className="h-4 w-20 rounded-full bg-slate-100" />
              <div className="h-4 w-16 rounded-full bg-slate-100" />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between gap-6">
                <div className="h-4 w-32 rounded-full bg-slate-200" />
                <div className="h-5 w-24 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
