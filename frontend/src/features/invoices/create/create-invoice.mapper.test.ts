import { describe, expect, it } from 'vitest';
import { mapCreateInvoiceFormToPayload } from './create-invoice.mapper';
import type { CreateInvoiceFormValues } from '@/features/invoices/schema/create-invoice.schema';

describe('mapCreateInvoiceFormToPayload', () => {
  it('trims required string fields', () => {
    // Arrange
    const values: CreateInvoiceFormValues = {
      customerName: '  John Doe  ',
      customerEmail: '  john@example.com  ',
      invoiceNumber: '  INV-001  ',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      currency: 'AUD',
      itemName: '  Service  ',
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = mapCreateInvoiceFormToPayload(values);

    // Assert
    expect(result.customerName).toBe('John Doe');
    expect(result.customerEmail).toBe('john@example.com');
    expect(result.invoiceNumber).toBe('INV-001');
    expect(result.item.name).toBe('Service');
  });

  it('converts empty optional fields to undefined', () => {
    // Arrange
    const values: CreateInvoiceFormValues = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerMobile: '',
      customerAddress: '',
      invoiceNumber: 'INV-001',
      invoiceReference: '',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      currency: 'AUD',
      description: '',
      itemName: 'Service',
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = mapCreateInvoiceFormToPayload(values);

    // Assert
    expect(result.customerMobile).toBeUndefined();
    expect(result.customerAddress).toBeUndefined();
    expect(result.invoiceReference).toBeUndefined();
    expect(result.description).toBeUndefined();
  });

  it('converts whitespace-only optional fields to undefined', () => {
    // Arrange
    const values: CreateInvoiceFormValues = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerMobile: '   ',
      customerAddress: '  \t  ',
      invoiceNumber: 'INV-001',
      invoiceReference: '   ',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      currency: 'AUD',
      description: '   ',
      itemName: 'Service',
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = mapCreateInvoiceFormToPayload(values);

    // Assert
    expect(result.customerMobile).toBeUndefined();
    expect(result.customerAddress).toBeUndefined();
    expect(result.invoiceReference).toBeUndefined();
    expect(result.description).toBeUndefined();
  });

  it('preserves optional fields with actual content', () => {
    // Arrange
    const values: CreateInvoiceFormValues = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerMobile: '0412345678',
      customerAddress: '123 Main St',
      invoiceNumber: 'INV-001',
      invoiceReference: 'REF-123',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      currency: 'AUD',
      description: 'Monthly service',
      itemName: 'Service',
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = mapCreateInvoiceFormToPayload(values);

    // Assert
    expect(result.customerMobile).toBe('0412345678');
    expect(result.customerAddress).toBe('123 Main St');
    expect(result.invoiceReference).toBe('REF-123');
    expect(result.description).toBe('Monthly service');
  });

  it('trims optional fields with leading/trailing whitespace', () => {
    // Arrange
    const values: CreateInvoiceFormValues = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerMobile: '  0412345678  ',
      customerAddress: '  123 Main St  ',
      invoiceNumber: 'INV-001',
      invoiceReference: '  REF-123  ',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      currency: 'AUD',
      description: '  Monthly service  ',
      itemName: 'Service',
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = mapCreateInvoiceFormToPayload(values);

    // Assert
    expect(result.customerMobile).toBe('0412345678');
    expect(result.customerAddress).toBe('123 Main St');
    expect(result.invoiceReference).toBe('REF-123');
    expect(result.description).toBe('Monthly service');
  });

  it('preserves numeric fields', () => {
    // Arrange
    const values: CreateInvoiceFormValues = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      invoiceNumber: 'INV-001',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      currency: 'AUD',
      itemName: 'Service',
      itemQuantity: 5,
      itemRate: 150.5,
      taxPercentage: 10,
      discount: 25.75,
    };

    // Act
    const result = mapCreateInvoiceFormToPayload(values);

    // Assert
    expect(result.item.quantity).toBe(5);
    expect(result.item.rate).toBe(150.5);
    expect(result.taxPercentage).toBe(10);
    expect(result.discount).toBe(25.75);
  });

  it('maps itemName, itemQuantity, itemRate into item object', () => {
    // Arrange
    const values: CreateInvoiceFormValues = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      invoiceNumber: 'INV-001',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      currency: 'AUD',
      itemName: '  Web Development  ',
      itemQuantity: 10,
      itemRate: 200,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = mapCreateInvoiceFormToPayload(values);

    // Assert
    expect(result.item).toEqual({
      name: 'Web Development',
      quantity: 10,
      rate: 200,
    });
  });

  it('preserves dates as-is', () => {
    // Arrange
    const values: CreateInvoiceFormValues = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      invoiceNumber: 'INV-001',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      currency: 'AUD',
      itemName: 'Service',
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = mapCreateInvoiceFormToPayload(values);

    // Assert
    expect(result.invoiceDate).toBe('2024-01-15');
    expect(result.dueDate).toBe('2024-02-15');
  });

  it('preserves currency code', () => {
    // Arrange
    const values: CreateInvoiceFormValues = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      invoiceNumber: 'INV-001',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      currency: 'USD',
      itemName: 'Service',
      itemQuantity: 1,
      itemRate: 100,
      taxPercentage: 10,
      discount: 0,
    };

    // Act
    const result = mapCreateInvoiceFormToPayload(values);

    // Assert
    expect(result.currency).toBe('USD');
  });
});
