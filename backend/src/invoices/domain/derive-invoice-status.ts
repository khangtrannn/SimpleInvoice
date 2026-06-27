import {
  InvoiceEffectiveStatus,
  InvoiceStatus,
} from '../enums/invoice-status.enum';

export function getTodayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

export function deriveInvoiceStatus(input: {
  persistedStatus: InvoiceStatus;
  dueDate: string;
}): InvoiceEffectiveStatus {
  const today = getTodayDateOnly();

  if (input.persistedStatus !== InvoiceStatus.PAID && input.dueDate < today) {
    return InvoiceEffectiveStatus.OVERDUE;
  }

  return input.persistedStatus as unknown as InvoiceEffectiveStatus;
}
