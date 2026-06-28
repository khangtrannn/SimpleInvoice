import { Eye, EyeOff } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { useState } from 'react';

import { FormField } from './FormField';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: string;
  requiredMark?: boolean;
};

export function PasswordInput({
  label,
  error,
  requiredMark,
  className = '',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField label={label} error={error} requiredMark={requiredMark}>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </FormField>
  );
}
