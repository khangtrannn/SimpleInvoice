import { describe, expect, it } from 'vitest';
import { formatPreviewMoney, formatPreviewDate } from './create-invoice-formatters';

describe('formatPreviewMoney', () => {
  it('formats with 2 decimal places', () => {
    // Arrange
    const amount = 100;
    const currencySymbol = '$';

    // Act
    const result = formatPreviewMoney(amount, currencySymbol);

    // Assert
    expect(result).toBe('$100.00');
  });

  it('includes the provided currency symbol', () => {
    // Arrange
    const amount = 150.5;
    const currencySymbol = 'AU$';

    // Act
    const result = formatPreviewMoney(amount, currencySymbol);

    // Assert
    expect(result).toBe('AU$150.50');
  });

  it('handles GBP currency symbol', () => {
    // Arrange
    const amount = 200;
    const currencySymbol = '£';

    // Act
    const result = formatPreviewMoney(amount, currencySymbol);

    // Assert
    expect(result).toBe('£200.00');
  });

  it('handles USD currency symbol', () => {
    // Arrange
    const amount = 300;
    const currencySymbol = 'US$';

    // Act
    const result = formatPreviewMoney(amount, currencySymbol);

    // Assert
    expect(result).toBe('US$300.00');
  });

  it('rounds to 2 decimal places', () => {
    // Arrange
    const amount = 99.999;
    const currencySymbol = '$';

    // Act
    const result = formatPreviewMoney(amount, currencySymbol);

    // Assert
    expect(result).toBe('$100.00');
  });

  it('handles zero amount', () => {
    // Arrange
    const amount = 0;
    const currencySymbol = '$';

    // Act
    const result = formatPreviewMoney(amount, currencySymbol);

    // Assert
    expect(result).toBe('$0.00');
  });

  it('handles large amounts with thousand separators', () => {
    // Arrange
    const amount = 1000000;
    const currencySymbol = '$';

    // Act
    const result = formatPreviewMoney(amount, currencySymbol);

    // Assert
    expect(result).toBe('$1,000,000.00');
  });

  it('handles decimal amounts correctly', () => {
    // Arrange
    const amount = 1234.56;
    const currencySymbol = '$';

    // Act
    const result = formatPreviewMoney(amount, currencySymbol);

    // Assert
    expect(result).toBe('$1,234.56');
  });

  it('handles small decimal amounts', () => {
    // Arrange
    const amount = 0.5;
    const currencySymbol = '$';

    // Act
    const result = formatPreviewMoney(amount, currencySymbol);

    // Assert
    expect(result).toBe('$0.50');
  });
});

describe('formatPreviewDate', () => {
  it('formats a valid date string', () => {
    // Arrange
    const dateValue = '2024-01-15';

    // Act
    const result = formatPreviewDate(dateValue);

    // Assert
    expect(result).toBe('Jan 15, 2024');
  });

  it('formats different months correctly', () => {
    // Arrange & Act & Assert
    expect(formatPreviewDate('2024-02-20')).toBe('Feb 20, 2024');
    expect(formatPreviewDate('2024-03-10')).toBe('Mar 10, 2024');
    expect(formatPreviewDate('2024-12-25')).toBe('Dec 25, 2024');
  });

  it('returns "-" for empty date string', () => {
    // Arrange
    const dateValue = '';

    // Act
    const result = formatPreviewDate(dateValue);

    // Assert
    expect(result).toBe('-');
  });

  it('handles single-digit day and month', () => {
    // Arrange
    const dateValue = '2024-01-05';

    // Act
    const result = formatPreviewDate(dateValue);

    // Assert
    expect(result).toBe('Jan 5, 2024');
  });

  it('handles double-digit day and month', () => {
    // Arrange
    const dateValue = '2024-12-31';

    // Act
    const result = formatPreviewDate(dateValue);

    // Assert
    expect(result).toBe('Dec 31, 2024');
  });

  it('formats date at start of year', () => {
    // Arrange
    const dateValue = '2024-01-01';

    // Act
    const result = formatPreviewDate(dateValue);

    // Assert
    expect(result).toBe('Jan 1, 2024');
  });

  it('formats date at end of year', () => {
    // Arrange
    const dateValue = '2024-12-31';

    // Act
    const result = formatPreviewDate(dateValue);

    // Assert
    expect(result).toBe('Dec 31, 2024');
  });
});
