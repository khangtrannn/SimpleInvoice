import { ChevronDown } from 'lucide-react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

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
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-500">
        {label}
        {requiredMark ? <span className="text-red-500"> *</span> : null}
      </span>

      <input
        className={`h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

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
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-500">
        {label}
        {requiredMark ? <span className="text-red-500"> *</span> : null}
      </span>

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

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}

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
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-500">
        {label}
        {requiredMark ? <span className="text-red-500"> *</span> : null}
      </span>

      <textarea
        rows={3}
        className={`w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </label>
  );
}
