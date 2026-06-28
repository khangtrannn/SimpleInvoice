import { ChevronDown } from 'lucide-react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

import { FormField } from './FormField';

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  requiredMark?: boolean;
  children: ReactNode;
};

export function SelectInput({
  label,
  error,
  requiredMark,
  children,
  className = '',
  ...props
}: SelectInputProps) {
  return (
    <FormField label={label} error={error} requiredMark={requiredMark}>
      <div className="relative">
        <select
          className={`h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
          {...props}
        >
          {children}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    </FormField>
  );
}
