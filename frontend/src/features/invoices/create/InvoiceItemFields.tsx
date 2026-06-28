import { Box } from 'lucide-react';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import { TextInput } from '@/shared/ui/form';
import type { CreateInvoiceFormInput } from '@/features/invoices/schema/create-invoice.schema';
import { SectionCard } from '@/shared/ui/SectionCard';

type InvoiceItemFieldsProps = {
  register: UseFormRegister<CreateInvoiceFormInput>;
  errors: FieldErrors<CreateInvoiceFormInput>;
  control: Control<CreateInvoiceFormInput>;
};

export function InvoiceItemFields({
  register,
  errors,
  control,
}: InvoiceItemFieldsProps) {
  const currency = useWatch({ control, name: 'currency' });

  return (
    <SectionCard
      icon={<Box className="h-5 w-5" />}
      title="Invoice Item"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-[1.5fr_0.7fr_1fr_0.8fr_1fr] md:items-start">
        <div className="col-span-2 md:col-span-1">
          <TextInput
            label="Item Name"
            requiredMark
            placeholder="Website Design"
            error={errors.itemName?.message}
            {...register('itemName')}
          />
        </div>

        <TextInput
          label="Quantity"
          requiredMark
          type="number"
          min={1}
          step={1}
          error={errors.itemQuantity?.message}
          {...register('itemQuantity')}
        />

        <TextInput
          label={`Rate (${currency})`}
          requiredMark
          type="number"
          min={0}
          step="0.01"
          error={errors.itemRate?.message}
          {...register('itemRate')}
        />

        <TextInput
          label="Tax (%)"
          type="number"
          min={0}
          step="0.01"
          error={errors.taxPercentage?.message}
          {...register('taxPercentage')}
        />

        <TextInput
          label={`Discount (${currency})`}
          type="number"
          min={0}
          step="0.01"
          error={errors.discount?.message}
          {...register('discount')}
        />
      </div>
    </SectionCard>
  );
}
