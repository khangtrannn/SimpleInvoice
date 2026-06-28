import { RotateCcw } from 'lucide-react';

type InvoiceResetFiltersButtonProps = {
  onReset: () => void;
};

export function InvoiceResetFiltersButton({
  onReset,
}: InvoiceResetFiltersButtonProps) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:w-11 sm:shrink-0"
      aria-label="Reset filters"
      title="Reset filters"
    >
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      <span className="text-sm font-medium sm:hidden">Reset filters</span>
    </button>
  );
}
