import { ApiProperty } from '@nestjs/swagger';

import { InvoiceEffectiveStatus } from '../enums/invoice-status.enum';

export class PagingResponseDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  pageSize!: number;

  @ApiProperty({ example: 100 })
  total!: number;
}

export class InvoiceCustomerResponseDto {
  @ApiProperty({ example: 'Paul' })
  fullname!: string;

  @ApiProperty({ example: 'paul@101digital.io' })
  email!: string;

  @ApiProperty({ example: '947717364111', nullable: true })
  mobileNumber!: string | null;

  @ApiProperty({ example: 'Singapore', nullable: true })
  address!: string | null;
}

export class InvoiceItemResponseDto {
  @ApiProperty({ example: 'b1c2d3e4-0000-0000-0000-000000000001' })
  id!: string;

  @ApiProperty({ example: 'Honda RC150' })
  name!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: '1000.00' })
  rate!: string;
}

export class InvoiceListItemResponseDto {
  @ApiProperty({ example: '099ca7da-a290-40fa-93b9-1c43ae7bb887' })
  id!: string;

  @ApiProperty({ example: 'IV1780488206995' })
  invoiceNumber!: string;

  @ApiProperty({ example: 'Paul' })
  customerName!: string;

  @ApiProperty({ example: '2026-06-03' })
  invoiceDate!: string;

  @ApiProperty({ example: '2026-07-03' })
  dueDate!: string;

  @ApiProperty({ example: 'AUD' })
  currency!: string;

  @ApiProperty({ example: 'AU$' })
  currencySymbol!: string;

  @ApiProperty({ example: '2180.00' })
  totalAmount!: string;

  @ApiProperty({ enum: InvoiceEffectiveStatus })
  status!: InvoiceEffectiveStatus;
}

export class InvoiceListResponseDto {
  @ApiProperty({ type: [InvoiceListItemResponseDto] })
  data!: InvoiceListItemResponseDto[];

  @ApiProperty({ type: PagingResponseDto })
  paging!: PagingResponseDto;
}

export class InvoiceDetailResponseDto {
  @ApiProperty({ example: '099ca7da-a290-40fa-93b9-1c43ae7bb887' })
  id!: string;

  @ApiProperty({ example: 'IV1780488206995' })
  invoiceNumber!: string;

  @ApiProperty({ example: '#5721662', nullable: true })
  invoiceReference!: string | null;

  @ApiProperty({ example: '2026-06-03' })
  invoiceDate!: string;

  @ApiProperty({ example: '2026-07-03' })
  dueDate!: string;

  @ApiProperty({ example: 'AUD' })
  currency!: string;

  @ApiProperty({ example: 'AU$' })
  currencySymbol!: string;

  @ApiProperty({ example: 'Invoice is issued to Kanglee', nullable: true })
  description!: string | null;

  @ApiProperty({ enum: InvoiceEffectiveStatus })
  status!: InvoiceEffectiveStatus;

  @ApiProperty({ type: InvoiceCustomerResponseDto })
  customer!: InvoiceCustomerResponseDto;

  @ApiProperty({ type: [InvoiceItemResponseDto] })
  items!: InvoiceItemResponseDto[];

  @ApiProperty({ example: '2000.00' })
  invoiceSubTotal!: string;

  @ApiProperty({ example: '10.00' })
  taxPercentage!: string;

  @ApiProperty({ example: '200.00' })
  totalTax!: string;

  @ApiProperty({ example: '20.00' })
  totalDiscount!: string;

  @ApiProperty({ example: '2180.00' })
  totalAmount!: string;

  @ApiProperty({ example: '1451.34' })
  totalPaid!: string;

  @ApiProperty({ example: '728.66' })
  balanceAmount!: string;

  @ApiProperty({ example: '2026-06-03T12:03:26.995Z' })
  createdAt!: Date;
}
