import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Receipt } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useCreateInvoice } from '@/features/invoices/hooks/use-create-invoice';
import {
  createInvoiceSchema,
  type CreateInvoiceFormInput,
  type CreateInvoiceFormValues,
} from '@/features/invoices/schema/create-invoice.schema';
import { getApiErrorMessage } from '@/shared/lib/api-error';
import { PageHeader } from '@/shared/ui/PageHeader';

import { getCreateInvoiceDefaultValues } from './create-invoice.defaults';
import { mapCreateInvoiceFormToPayload } from './create-invoice.mapper';
import { CustomerInformationFields } from './CustomerInformationFields';
import { InvoiceInformationFields } from './InvoiceInformationFields';
import { InvoiceItemFields } from './InvoiceItemFields';
import { InvoicePreview } from './InvoicePreview';

export function CreateInvoiceForm() {
  const navigate = useNavigate();
  const createInvoiceMutation = useCreateInvoice();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateInvoiceFormInput, unknown, CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: getCreateInvoiceDefaultValues(),
  });

  function onSubmit(values: CreateInvoiceFormValues) {
    const payload = mapCreateInvoiceFormToPayload(values);

    createInvoiceMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Invoice created successfully.');
        navigate('/invoices', { replace: true });
      },
      onError: (error) => {
        const message = getApiErrorMessage(error, 'Failed to create invoice.');

        if (message.toLowerCase().includes('invoice number')) {
          setError('invoiceNumber', {
            type: 'server',
            message,
          });
        }

        toast.error(message);
      },
    });
  }

  const isSubmitting = createInvoiceMutation.isPending;

  return (
    <div>
      <form id="create-invoice-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <PageHeader
            breadcrumb={[{ label: 'Invoices', to: '/invoices' }, { label: 'Create Invoice' }]}
            title="Create Invoice"
            subtitle="Create a new invoice and deliver it instantly."
            actions={
              <Link
                to="/invoices"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back to Invoices
              </Link>
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.9fr]">
          <div className="space-y-5">
            <CustomerInformationFields register={register} errors={errors} />

            <InvoiceInformationFields register={register} errors={errors} />

            <InvoiceItemFields
              register={register}
              errors={errors}
              control={control}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-black disabled:bg-slate-400"
              >
                <Receipt className="h-4 w-4" aria-hidden="true" />
                {isSubmitting ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </div>

          <div>
            <InvoicePreview control={control} />
          </div>
        </div>
      </form>
    </div>
  );
}
