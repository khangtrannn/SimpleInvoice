export function InvoiceListSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden">
      {/* Desktop skeleton */}
      <div className="hidden lg:block">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-3.5">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-3 rounded-full bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 px-6 py-4">
              <div className="h-4 rounded-full bg-slate-200" />
              <div className="h-4 rounded-full bg-slate-100" />
              <div className="h-4 w-3/4 rounded-full bg-slate-100" />
              <div className="h-4 w-3/4 rounded-full bg-slate-100" />
              <div className="h-4 rounded-full bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile card skeleton */}
      <div className="divide-y divide-slate-100 lg:hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="space-y-4 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-full bg-slate-200" />
                  <div className="h-3 w-32 rounded-full bg-slate-100" />
                </div>
              </div>
              <div className="h-6 w-16 rounded-full bg-slate-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="h-2.5 w-16 rounded-full bg-slate-100" />
                <div className="h-3.5 w-24 rounded-full bg-slate-200" />
              </div>
              <div className="space-y-2">
                <div className="h-2.5 w-16 rounded-full bg-slate-100" />
                <div className="h-3.5 w-24 rounded-full bg-slate-200" />
              </div>
              <div className="col-span-2 space-y-2">
                <div className="h-2.5 w-12 rounded-full bg-slate-100" />
                <div className="h-3.5 w-28 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
