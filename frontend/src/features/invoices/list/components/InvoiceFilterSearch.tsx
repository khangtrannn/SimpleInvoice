import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { InvoiceListQuery } from '@/api/types';

type InvoiceFilterSearchProps = {
  keyword?: string;
  onChange: (query: Partial<InvoiceListQuery>) => void;
};

export function InvoiceFilterSearch({
  keyword: currentKeyword,
  onChange,
}: InvoiceFilterSearchProps) {
  const [keyword, setKeyword] = useState(currentKeyword ?? '');

  useEffect(() => {
    setKeyword(currentKeyword ?? '');
  }, [currentKeyword]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextKeyword = keyword.trim() || undefined;

      if ((currentKeyword ?? undefined) !== nextKeyword) {
        onChange({
          keyword: nextKeyword,
          page: 1,
        });
      }
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [keyword, currentKeyword, onChange]);

  return (
    <div className="w-full sm:min-w-[240px] sm:flex-[2]">
      <p className="mb-1.5 text-xs font-medium text-slate-500">Search</p>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />

        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search by invoice number or customer name..."
          className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </div>
    </div>
  );
}
