import type { InvoiceDetail, InvoiceListItem } from '@/api/types';
import {
  createMockInvoiceDetailFromListItem,
  createMockInvoiceListItem,
} from '@/test/factories/invoice.factory';

export const mockInvoices: InvoiceListItem[] = [
  createMockInvoiceListItem({
    id: 'invoice-1',
    invoiceNumber: 'INV-2026-001',
    customerName: 'Acme Corporation',
    invoiceDate: '2026-05-12',
    dueDate: '2026-05-26',
    totalAmount: '2450.00',
    status: 'Paid',
  }),
  createMockInvoiceListItem({
    id: 'invoice-2',
    invoiceNumber: 'INV-2026-002',
    customerName: 'Bright Ideas Pty Ltd',
    invoiceDate: '2026-05-10',
    dueDate: '2026-05-24',
    totalAmount: '1850.00',
    status: 'Pending',
  }),
  createMockInvoiceListItem({
    id: 'invoice-3',
    invoiceNumber: 'INV-2026-003',
    customerName: 'Creative Studio',
    invoiceDate: '2026-05-08',
    dueDate: '2026-05-22',
    totalAmount: '3200.00',
    status: 'Overdue',
  }),
  createMockInvoiceListItem({
    id: 'invoice-4',
    invoiceNumber: 'INV-2026-004',
    customerName: 'Delta Solutions',
    invoiceDate: '2026-05-05',
    dueDate: '2026-05-19',
    totalAmount: '950.00',
    status: 'Draft',
  }),
  createMockInvoiceListItem({
    id: 'invoice-5',
    invoiceNumber: 'INV-2026-005',
    customerName: 'Echo Enterprises',
    invoiceDate: '2026-05-03',
    dueDate: '2026-05-17',
    totalAmount: '5600.00',
    status: 'Paid',
  }),
  createMockInvoiceListItem({
    id: 'invoice-6',
    invoiceNumber: 'INV-2026-006',
    customerName: 'Future Tech',
    invoiceDate: '2026-04-30',
    dueDate: '2026-05-14',
    totalAmount: '4120.00',
    status: 'Pending',
  }),
  createMockInvoiceListItem({
    id: 'invoice-7',
    invoiceNumber: 'INV-2026-007',
    customerName: 'Greenfield Ltd',
    invoiceDate: '2026-04-28',
    dueDate: '2026-05-12',
    totalAmount: '1270.00',
    status: 'Overdue',
  }),
  createMockInvoiceListItem({
    id: 'invoice-8',
    invoiceNumber: 'INV-2026-008',
    customerName: 'Horizon Marketing',
    invoiceDate: '2026-04-25',
    dueDate: '2026-05-09',
    totalAmount: '750.00',
    status: 'Draft',
  }),
];

export const mockInvoiceDetails: Record<string, InvoiceDetail> =
  Object.fromEntries(
    mockInvoices.map((invoice, index) => [
      invoice.id,
      createMockInvoiceDetailFromListItem(invoice, index),
    ]),
  );
