import {
  InvoiceEffectiveStatus,
  InvoiceStatus,
} from '../enums/invoice-status.enum';

export function deriveInvoiceStatus(input: {
  persistedStatus: InvoiceStatus;
  dueDate: string;
  today: string;
}): InvoiceEffectiveStatus {
  if (input.persistedStatus !== InvoiceStatus.PAID && input.dueDate < input.today) {
    return InvoiceEffectiveStatus.OVERDUE;
  }

  return input.persistedStatus as unknown as InvoiceEffectiveStatus;
}
