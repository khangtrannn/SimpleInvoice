import { User } from 'lucide-react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { TextInput } from '@/shared/ui/form';
import type { CreateInvoiceFormInput } from '@/features/invoices/schema/create-invoice.schema';

import { CreateInvoiceSectionCard } from './CreateInvoiceSectionCard';

type CustomerInformationFieldsProps = {
  register: UseFormRegister<CreateInvoiceFormInput>;
  errors: FieldErrors<CreateInvoiceFormInput>;
};

export function CustomerInformationFields({
  register,
  errors,
}: CustomerInformationFieldsProps) {
  return (
    <CreateInvoiceSectionCard
      icon={<User className="h-5 w-5" />}
      title="Customer Information"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Customer Name"
          requiredMark
          placeholder="e.g. Acme Corporation"
          error={errors.customerName?.message}
          {...register('customerName')}
        />

        <TextInput
          label="Customer Email"
          requiredMark
          type="email"
          placeholder="name@example.com"
          error={errors.customerEmail?.message}
          {...register('customerEmail')}
        />

        <TextInput
          label="Customer Mobile"
          placeholder="e.g. +61 400 123 456"
          error={errors.customerMobile?.message}
          {...register('customerMobile')}
        />

        <TextInput
          label="Customer Address"
          placeholder="e.g. 123 Market St, Sydney, NSW 2000"
          error={errors.customerAddress?.message}
          {...register('customerAddress')}
        />
      </div>
    </CreateInvoiceSectionCard>
  );
}
