import Decimal from 'decimal.js';

import type {
  CalculateInvoiceTotalsInput,
  InvoiceTotals,
} from './invoice-calculation.types';

export function toMoney(value: Decimal.Value): string {
  return new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
}

export function calculateInvoiceTotals(
  input: CalculateInvoiceTotalsInput,
): InvoiceTotals {
  const quantity = new Decimal(input.quantity);
  const rate = new Decimal(input.rate);
  const taxPercentage = new Decimal(input.taxPercentage);
  const discount = new Decimal(input.discount);
  const totalPaid = new Decimal(input.totalPaid);

  const invoiceSubTotal = quantity.mul(rate);
  const totalTax = invoiceSubTotal.mul(taxPercentage).div(100);
  const totalAmount = invoiceSubTotal.plus(totalTax).minus(discount);
  const balanceAmount = totalAmount.minus(totalPaid);

  return {
    invoiceSubTotal: toMoney(invoiceSubTotal),
    totalTax: toMoney(totalTax),
    totalAmount: toMoney(totalAmount),
    balanceAmount: toMoney(balanceAmount),
  };
}