import {
  calculateInvoiceTotals,
  InvoiceCalculationError,
} from './invoice-calculation';

describe(calculateInvoiceTotals.name, () => {
  it('should reject a discount greater than subtotal plus tax', () => {
    expect(() =>
      calculateInvoiceTotals({
        quantity: 1,
        rate: 100,
        taxPercentage: 10,
        discount: 111,
      }),
    ).toThrow(
      new InvoiceCalculationError('discount must not exceed subtotal plus tax'),
    );
  });

  it('should reject total paid greater than total amount', () => {
    expect(() =>
      calculateInvoiceTotals({
        quantity: 1,
        rate: 100,
        taxPercentage: 10,
        discount: 0,
        totalPaid: 111,
      }),
    ).toThrow(
      new InvoiceCalculationError('totalPaid must not exceed totalAmount'),
    );
  });
});
