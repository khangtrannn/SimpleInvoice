import { InvoiceEntity } from '../entities/invoice.entity';
import {
  InvoiceDetailResponseDto,
  InvoiceListItemResponseDto,
} from '../dto/invoice-response.dto';
import { deriveInvoiceStatus } from '../domain/derive-invoice-status';

export function toInvoiceListItemResponse(
  invoice: InvoiceEntity,
): InvoiceListItemResponseDto {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerFullname,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    currency: invoice.currency,
    currencySymbol: invoice.currencySymbol,
    totalAmount: invoice.totalAmount,
    status: deriveInvoiceStatus({
      persistedStatus: invoice.status,
      dueDate: invoice.dueDate,
    }),
  };
}

export function toInvoiceDetailResponse(
  invoice: InvoiceEntity,
): InvoiceDetailResponseDto {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    invoiceReference: invoice.invoiceReference,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    currency: invoice.currency,
    currencySymbol: invoice.currencySymbol,
    description: invoice.description,
    status: deriveInvoiceStatus({
      persistedStatus: invoice.status,
      dueDate: invoice.dueDate,
    }),
    customer: {
      fullname: invoice.customerFullname,
      email: invoice.customerEmail,
      mobileNumber: invoice.customerMobileNumber,
      address: invoice.customerAddress,
    },
    items: invoice.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      rate: item.rate,
    })),
    invoiceSubTotal: invoice.invoiceSubTotal,
    taxPercentage: invoice.taxPercentage,
    totalTax: invoice.totalTax,
    totalDiscount: invoice.totalDiscount,
    totalAmount: invoice.totalAmount,
    totalPaid: invoice.totalPaid,
    balanceAmount: invoice.balanceAmount,
    createdAt: invoice.createdAt,
  };
}
