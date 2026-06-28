import type { InputHTMLAttributes } from 'react';

import { FormField } from './FormField';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  requiredMark?: boolean;
};

export function TextInput({
  label,
  error,
  requiredMark,
  className = '',
  ...props
}: TextInputProps) {
  return (
    <FormField label={label} error={error} requiredMark={requiredMark}>
      <input
        className={`h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />
    </FormField>
  );
}
