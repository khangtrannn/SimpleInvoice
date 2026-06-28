import { ApiProperty } from '@nestjs/swagger';

import { InvoiceEffectiveStatus } from '../enums/invoice-status.enum';

export class PagingResponseDto {
  @ApiProperty({ type: Number, example: 1 })
  page!: number;

  @ApiProperty({ type: Number, example: 10 })
  pageSize!: number;

  @ApiProperty({ type: Number, example: 100 })
  total!: number;
}

export class InvoiceCustomerResponseDto {
  @ApiProperty({ type: String, example: 'Paul' })
  fullname!: string;

  @ApiProperty({ type: String, example: 'paul@101digital.io' })
  email!: string;

  @ApiProperty({ type: String, example: '947717364111', nullable: true })
  mobileNumber!: string | null;

  @ApiProperty({ type: String, example: 'Singapore', nullable: true })
  address!: string | null;
}

export class InvoiceItemResponseDto {
  @ApiProperty({
    type: String,
    example: 'b1c2d3e4-0000-0000-0000-000000000001',
  })
  id!: string;

  @ApiProperty({ type: String, example: 'Honda RC150' })
  name!: string;

  @ApiProperty({ type: Number, example: 2 })
  quantity!: number;

  @ApiProperty({ type: String, example: '1000.00' })
  rate!: string;
}

export class InvoiceListItemResponseDto {
  @ApiProperty({
    type: String,
    example: '099ca7da-a290-40fa-93b9-1c43ae7bb887',
  })
  id!: string;

  @ApiProperty({ type: String, example: 'IV1780488206995' })
  invoiceNumber!: string;

  @ApiProperty({ type: String, example: 'Paul' })
  customerName!: string;

  @ApiProperty({ type: String, example: '2026-06-03' })
  invoiceDate!: string;

  @ApiProperty({ type: String, example: '2026-07-03' })
  dueDate!: string;

  @ApiProperty({ type: String, example: 'AUD' })
  currency!: string;

  @ApiProperty({ type: String, example: 'AU$' })
  currencySymbol!: string;

  @ApiProperty({ type: String, example: '2180.00' })
  totalAmount!: string;

  @ApiProperty({ enum: InvoiceEffectiveStatus })
  status!: InvoiceEffectiveStatus;
}

export class InvoiceSummaryResponseDto {
  @ApiProperty({ type: String, example: '81751.09' })
  totalRevenue!: string;

  @ApiProperty({ type: String, example: '0.00' })
  totalPaid!: string;

  @ApiProperty({ type: String, example: '0.00' })
  totalPending!: string;

  @ApiProperty({ type: String, example: '0.00' })
  totalOverdue!: string;

  @ApiProperty({ type: String, example: '0.00' })
  totalDraft!: string;

  @ApiProperty({ type: Number, example: 5 })
  paidCount!: number;

  @ApiProperty({ type: Number, example: 3 })
  pendingCount!: number;

  @ApiProperty({ type: Number, example: 2 })
  overdueCount!: number;

  @ApiProperty({ type: Number, example: 8 })
  draftCount!: number;

  @ApiProperty({ type: String, example: 'AUD', nullable: true })
  currency!: string | null;

  @ApiProperty({ type: String, example: 'AU$', nullable: true })
  currencySymbol!: string | null;

  @ApiProperty({ type: Number, example: 1 })
  currencyCount!: number;
}

export class InvoiceListResponseDto {
  @ApiProperty({ type: [InvoiceListItemResponseDto] })
  data!: InvoiceListItemResponseDto[];

  @ApiProperty({ type: PagingResponseDto })
  paging!: PagingResponseDto;
}

export class InvoiceDetailResponseDto {
  @ApiProperty({
    type: String,
    example: '099ca7da-a290-40fa-93b9-1c43ae7bb887',
  })
  id!: string;

  @ApiProperty({ type: String, example: 'IV1780488206995' })
  invoiceNumber!: string;

  @ApiProperty({ type: String, example: '#5721662', nullable: true })
  invoiceReference!: string | null;

  @ApiProperty({ type: String, example: '2026-06-03' })
  invoiceDate!: string;

  @ApiProperty({ type: String, example: '2026-07-03' })
  dueDate!: string;

  @ApiProperty({ type: String, example: 'AUD' })
  currency!: string;

  @ApiProperty({ type: String, example: 'AU$' })
  currencySymbol!: string;

  @ApiProperty({
    type: String,
    example: 'Invoice is issued to Kanglee',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ enum: InvoiceEffectiveStatus })
  status!: InvoiceEffectiveStatus;

  @ApiProperty({ type: InvoiceCustomerResponseDto })
  customer!: InvoiceCustomerResponseDto;

  @ApiProperty({ type: [InvoiceItemResponseDto] })
  items!: InvoiceItemResponseDto[];

  @ApiProperty({ type: String, example: '2000.00' })
  invoiceSubTotal!: string;

  @ApiProperty({ type: String, example: '10.00' })
  taxPercentage!: string;

  @ApiProperty({ type: String, example: '200.00' })
  totalTax!: string;

  @ApiProperty({ type: String, example: '20.00' })
  totalDiscount!: string;

  @ApiProperty({ type: String, example: '2180.00' })
  totalAmount!: string;

  @ApiProperty({ type: String, example: '1451.34' })
  totalPaid!: string;

  @ApiProperty({ type: String, example: '728.66' })
  balanceAmount!: string;

  @ApiProperty({ type: String, example: '2026-06-03T12:03:26.995Z' })
  createdAt!: Date;
}
