import Decimal from 'decimal.js';

import type {
  CalculateInvoiceTotalsInput,
  InvoiceTotals,
} from './invoice-calculation.types';

export class InvoiceCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = InvoiceCalculationError.name;
  }
}

export function toMoney(value: Decimal.Value): string {
  return new Decimal(value)
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
    .toFixed(2);
}

export function calculateInvoiceTotals(
  input: CalculateInvoiceTotalsInput,
): InvoiceTotals {
  const quantity = new Decimal(input.quantity);
  const rate = new Decimal(input.rate);
  const taxPercentage = new Decimal(input.taxPercentage);
  const discount = new Decimal(input.discount);
  const totalPaid = new Decimal(input.totalPaid ?? 0);

  const invoiceSubTotal = quantity.mul(rate);
  const totalTax = invoiceSubTotal.mul(taxPercentage).div(100);
  const totalAmount = invoiceSubTotal.plus(totalTax).minus(discount);
  const balanceAmount = totalAmount.minus(totalPaid);

  if (totalAmount.isNegative()) {
    throw new InvoiceCalculationError(
      'discount must not exceed subtotal plus tax',
    );
  }

  if (balanceAmount.isNegative()) {
    throw new InvoiceCalculationError('totalPaid must not exceed totalAmount');
  }

  return {
    invoiceSubTotal: toMoney(invoiceSubTotal),
    totalTax: toMoney(totalTax),
    totalDiscount: toMoney(discount),
    totalAmount: toMoney(totalAmount),
    totalPaid: toMoney(totalPaid),
    balanceAmount: toMoney(balanceAmount),
  };
}
