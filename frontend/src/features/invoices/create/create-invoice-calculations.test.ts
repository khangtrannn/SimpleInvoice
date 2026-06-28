import { describe, expect, it } from 'vitest';
import { calculateInvoicePreview } from './create-invoice-calculations';
import type { CurrencyCode } from '@/api/types';

describe('calculateInvoicePreview', () => {
  it('calculates subtotal correctly', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 5,
      itemRate: 100,
      taxPercentage: 0,
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.subtotal).toBe(500);
  });

  it('calculates taxAmount correctly', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 10,
      itemRate: 100,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.subtotal).toBe(1000);
    expect(result.taxAmount).toBe(100);
  });

  it('calculates totalAmount with tax', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 10,
      itemRate: 100,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.totalAmount).toBe(1100);
  });

  it('calculates totalAmount with discount', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 10,
      itemRate: 100,
      taxPercentage: 0,
      discount: 200,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.subtotal).toBe(1000);
    expect(result.totalAmount).toBe(800);
  });

  it('calculates totalAmount with tax and discount', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 10,
      itemRate: 100,
      taxPercentage: 10,
      discount: 50,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.subtotal).toBe(1000);
    expect(result.taxAmount).toBe(100);
    expect(result.totalAmount).toBe(1050);
  });

  it('treats empty quantity as 0', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: '',
      itemRate: 100,
      taxPercentage: 0,
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.subtotal).toBe(0);
    expect(result.totalAmount).toBe(0);
  });

  it('treats empty rate as 0', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 5,
      itemRate: '',
      taxPercentage: 0,
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.subtotal).toBe(0);
    expect(result.totalAmount).toBe(0);
  });

  it('treats empty tax percentage as 0', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 10,
      itemRate: 100,
      taxPercentage: '',
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.taxAmount).toBe(0);
    expect(result.totalAmount).toBe(1000);
  });

  it('treats empty discount as 0', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 10,
      itemRate: 100,
      taxPercentage: 10,
      discount: '',
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.discount).toBe(0);
    expect(result.totalAmount).toBe(1100);
  });

  it('treats invalid numeric values as 0', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 'invalid',
      itemRate: 'not-a-number',
      taxPercentage: 'abc',
      discount: 'xyz',
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.subtotal).toBe(0);
    expect(result.taxAmount).toBe(0);
    expect(result.discount).toBe(0);
    expect(result.totalAmount).toBe(0);
  });

  it('returns currency option for AUD', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 0,
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.currency).toEqual({
      code: 'AUD',
      label: 'AUD - Australian Dollar',
      symbol: 'AU$',
    });
  });

  it('returns currency option for USD', () => {
    // Arrange
    const values = {
      currency: 'USD' as CurrencyCode,
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 0,
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.currency).toEqual({
      code: 'USD',
      label: 'USD - US Dollar',
      symbol: 'US$',
    });
  });

  it('returns currency option for GBP', () => {
    // Arrange
    const values = {
      currency: 'GBP' as CurrencyCode,
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 0,
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.currency).toEqual({
      code: 'GBP',
      label: 'GBP - British Pound',
      symbol: '£',
    });
  });

  it('handles decimal quantities and rates', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 2.5,
      itemRate: 99.99,
      taxPercentage: 10,
      discount: 10,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.subtotal).toBeCloseTo(249.975);
    expect(result.taxAmount).toBeCloseTo(24.9975);
    expect(result.totalAmount).toBeCloseTo(264.9725);
  });

  it('handles zero values correctly', () => {
    // Arrange
    const values = {
      currency: 'AUD' as CurrencyCode,
      itemQuantity: 0,
      itemRate: 0,
      taxPercentage: 0,
      discount: 0,
    };

    // Act
    const result = calculateInvoicePreview(values);

    // Assert
    expect(result.subtotal).toBe(0);
    expect(result.taxAmount).toBe(0);
    expect(result.discount).toBe(0);
    expect(result.totalAmount).toBe(0);
  });
});
