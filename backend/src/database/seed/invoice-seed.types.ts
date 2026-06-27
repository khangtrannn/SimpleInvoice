import { InvoiceStatus } from '../../invoices/enums/invoice-status.enum';

export type InvoiceSeedItemInput = {
  id?: string;
  name: string;
  quantity: number;
  rate: string;
};

export type InvoiceSeedInput = {
  id?: string;
  invoiceNumber: string;
  invoiceReference?: string | null;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  currencySymbol: string;
  description?: string | null;
  status: InvoiceStatus;

  customerFullname: string;
  customerEmail: string;
  customerMobileNumber?: string | null;
  customerAddress?: string | null;

  item: InvoiceSeedItemInput;

  taxPercentage: string;
  totalDiscount: string;
  totalPaid: string;
};
