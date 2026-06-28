import { z } from 'zod';

export const createInvoiceSchema = z
  .object({
    customerName: z.string().trim().min(1, 'Customer name is required.'),
    customerEmail: z
      .string()
      .trim()
      .min(1, 'Customer email is required.')
      .email('Please enter a valid customer email.'),
    customerMobile: z.string().trim().optional(),
    customerAddress: z.string().trim().optional(),
    invoiceNumber: z.string().trim().min(1, 'Invoice number is required.'),
    invoiceDate: z.string().min(1, 'Invoice date is required.'),
    dueDate: z.string().min(1, 'Due date is required.'),
    currency: z.enum(['AUD', 'USD', 'GBP']),
    invoiceReference: z.string().trim().optional(),
    description: z.string().trim().optional(),
    itemName: z.string().trim().min(1, 'Item name is required.'),
    itemQuantity: z.coerce
      .number()
      .int('Quantity must be an integer.')
      .positive('Quantity must be greater than 0.'),
    itemRate: z.coerce.number().positive('Rate must be greater than 0.'),
    taxPercentage: z.coerce.number().min(0, 'Tax must be a non-negative number.'),
    discount: z.coerce.number().min(0, 'Discount must be a non-negative number.'),
  })
  .superRefine((values, context) => {
    if (!values.invoiceDate || !values.dueDate) {
      return;
    }

    const invoiceDate = new Date(`${values.invoiceDate}T00:00:00`);
    const dueDate = new Date(`${values.dueDate}T00:00:00`);

    if (dueDate < invoiceDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dueDate'],
        message: 'Due date must be on or after invoice date.',
      });
    }
  });

export type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>;
export type CreateInvoiceFormInput = z.input<typeof createInvoiceSchema>;
