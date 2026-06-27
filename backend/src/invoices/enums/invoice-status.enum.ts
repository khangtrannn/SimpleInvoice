export enum InvoiceStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  PAID = 'Paid',
}

export enum InvoiceEffectiveStatus {
  DRAFT = InvoiceStatus.DRAFT,
  PENDING = InvoiceStatus.PENDING,
  PAID = InvoiceStatus.PAID,
  OVERDUE = 'Overdue',
}
