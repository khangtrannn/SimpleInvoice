import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { trimOptionalString } from '../../common/transforms/string.transforms';
import { IsDateOnly } from '../../common/validators/is-date-only.validator';
import { IsDateRange } from '../../common/validators/is-date-range.validator';
import { InvoiceEffectiveStatus } from '../enums/invoice-status.enum';

export enum InvoiceSortBy {
  INVOICE_DATE = 'invoiceDate',
  DUE_DATE = 'dueDate',
  TOTAL_AMOUNT = 'totalAmount',
}

export enum SortOrdering {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetInvoicesQueryDto {
  @IsDateRange('fromDate', 'toDate', {
    message: 'fromDate must be on or before toDate',
  })
  private readonly dateRange?: never;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 10;

  @ApiPropertyOptional({
    enum: InvoiceSortBy,
    default: InvoiceSortBy.INVOICE_DATE,
  })
  @IsOptional()
  @IsEnum(InvoiceSortBy)
  sortBy = InvoiceSortBy.INVOICE_DATE;

  @ApiPropertyOptional({
    enum: SortOrdering,
    default: SortOrdering.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrdering)
  ordering = SortOrdering.DESC;

  @ApiPropertyOptional({
    enum: InvoiceEffectiveStatus,
  })
  @IsOptional()
  @IsEnum(InvoiceEffectiveStatus)
  status?: InvoiceEffectiveStatus;

  @ApiPropertyOptional({
    type: String,
    example: 'Paul',
    description:
      'Partial case-insensitive search on invoice number or customer name',
  })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(100)
  keyword?: string;

  @ApiPropertyOptional({
    type: String,
    example: '2026-06-01',
    description: 'Filter invoices with invoiceDate on or after this date',
  })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsDateOnly()
  fromDate?: string;

  @ApiPropertyOptional({
    type: String,
    example: '2026-06-30',
    description: 'Filter invoices with invoiceDate on or before this date',
  })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsDateOnly()
  toDate?: string;
}
