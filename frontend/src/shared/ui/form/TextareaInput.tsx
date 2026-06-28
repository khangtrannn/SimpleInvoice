import type { TextareaHTMLAttributes } from 'react';

import { FormField } from './FormField';

type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  requiredMark?: boolean;
};

export function TextareaInput({
  label,
  error,
  requiredMark,
  className = '',
  ...props
}: TextareaInputProps) {
  return (
    <FormField label={label} error={error} requiredMark={requiredMark}>
      <textarea
        rows={3}
        className={`w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />
    </FormField>
  );
}
