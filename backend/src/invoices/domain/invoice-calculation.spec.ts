import {
  calculateInvoiceTotals,
  InvoiceCalculationError,
  toMoney,
} from './invoice-calculation';

describe(calculateInvoiceTotals.name, () => {
  it('should calculate subtotal, tax, discount, total, paid, and balance', () => {
    // Arrange
    const input = {
      quantity: 2,
      rate: 100,
      taxPercentage: 10,
      discount: 20,
    };

    // Act
    const result = calculateInvoiceTotals(input);

    // Assert
    expect(result).toEqual({
      invoiceSubTotal: '200.00',
      totalTax: '20.00',
      totalDiscount: '20.00',
      totalAmount: '200.00',
      totalPaid: '0.00',
      balanceAmount: '200.00',
    });
  });

  it('should default tax, discount, and totalPaid to zero', () => {
    // Arrange
    const input = {
      quantity: 3,
      rate: 50,
    };

    // Act
    const result = calculateInvoiceTotals(input);

    // Assert
    expect(result).toEqual({
      invoiceSubTotal: '150.00',
      totalTax: '0.00',
      totalDiscount: '0.00',
      totalAmount: '150.00',
      totalPaid: '0.00',
      balanceAmount: '150.00',
    });
  });

  it('should round money values to 2 decimals using half-up rounding', () => {
    // Arrange
    const value = 10.005;

    // Act
    const result = toMoney(value);

    // Assert
    expect(result).toBe('10.01');
  });

  it('should throw InvoiceCalculationError when discount is greater than subtotal plus tax', () => {
    // Arrange
    const input = {
      quantity: 1,
      rate: 100,
      taxPercentage: 10,
      discount: 111,
    };

    // Act
    const act = () => calculateInvoiceTotals(input);

    // Assert
    expect(act).toThrow(InvoiceCalculationError);
  });

  it('should throw InvoiceCalculationError when totalPaid is greater than total amount', () => {
    // Arrange
    const input = {
      quantity: 1,
      rate: 100,
      taxPercentage: 10,
      discount: 0,
      totalPaid: 111,
    };

    // Act
    const act = () => calculateInvoiceTotals(input);

    // Assert
    expect(act).toThrow(InvoiceCalculationError);
  });
});
