import type Decimal from 'decimal.js';

export type CalculateInvoiceTotalsInput = {
  quantity: number;
  rate: Decimal.Value;
  taxPercentage: Decimal.Value;
  discount: Decimal.Value;
  totalPaid?: Decimal.Value;
};

export type InvoiceTotals = {
  invoiceSubTotal: string;
  totalTax: string;
  totalDiscount: string;
  totalAmount: string;
  totalPaid: string;
  balanceAmount: string;
};
