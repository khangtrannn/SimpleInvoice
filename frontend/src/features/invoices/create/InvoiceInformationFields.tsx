import { FileText } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { SelectInput, TextareaInput, TextInput } from '@/shared/ui/form';
import type { CreateInvoiceFormInput } from '@/features/invoices/schema/create-invoice.schema';
import { CURRENCY_OPTIONS } from '@/shared/lib/currency';

import { CreateInvoiceSectionCard } from './CreateInvoiceSectionCard';

type InvoiceInformationFieldsProps = {
  register: UseFormRegister<CreateInvoiceFormInput>;
  errors: FieldErrors<CreateInvoiceFormInput>;
};

export function InvoiceInformationFields({
  register,
  errors,
}: InvoiceInformationFieldsProps) {
  return (
    <CreateInvoiceSectionCard
      icon={<FileText className="h-5 w-5" />}
      title="Invoice Information"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <TextInput
          label="Invoice Number"
          requiredMark
          placeholder="INV-2026-009"
          error={errors.invoiceNumber?.message}
          {...register('invoiceNumber')}
        />

        <TextInput
          label="Invoice Date"
          requiredMark
          type="date"
          error={errors.invoiceDate?.message}
          {...register('invoiceDate')}
        />

        <TextInput
          label="Due Date"
          requiredMark
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SelectInput
          label="Currency"
          requiredMark
          error={errors.currency?.message}
          {...register('currency')}
        >
          {CURRENCY_OPTIONS.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.label}
            </option>
          ))}
        </SelectInput>

        <TextInput
          label="Invoice Reference"
          placeholder="e.g. PO #1234"
          error={errors.invoiceReference?.message}
          {...register('invoiceReference')}
        />
      </div>

      <div className="mt-4">
        <TextareaInput
          label="Description"
          placeholder="e.g. Services provided in May 2026"
          error={errors.description?.message}
          {...register('description')}
        />
      </div>
    </CreateInvoiceSectionCard>
  );
}
