import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  error?: string;
  requiredMark?: boolean;
  children: ReactNode;
};

export function FormField({
  label,
  error,
  requiredMark,
  children,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-500">
        {label}
        {requiredMark ? <span className="text-red-500"> *</span> : null}
      </span>

      {children}

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
