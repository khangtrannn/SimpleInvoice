import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsDefined,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  trimLowercaseString,
  trimOptionalString,
  trimString,
  trimUppercaseString,
} from '../../common/transforms/string.transforms';
import { IsDateOnly } from '../../common/validators/is-date-only.validator';
import { IsDateOnOrAfter } from '../../common/validators/is-date-on-or-after.validator';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';
import { SUPPORTED_CURRENCIES } from '../utils/currency-symbol.util';

export class CreateInvoiceDto {
  @ApiProperty({
    example: 'Paul',
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  customerName!: string;

  @ApiProperty({
    example: 'paul@101digital.io',
  })
  @Transform(({ value }) => trimLowercaseString(value))
  @IsEmail()
  @MaxLength(255)
  customerEmail!: string;

  @ApiPropertyOptional({
    example: '947717364111',
  })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerMobile?: string;

  @ApiPropertyOptional({
    example: 'Singapore',
  })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  customerAddress?: string;

  @ApiProperty({
    example: 'IV1780488206995',
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  invoiceNumber!: string;

  @ApiPropertyOptional({
    example: '#5721662',
  })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  @MaxLength(100)
  invoiceReference?: string;

  @ApiProperty({
    example: '2026-06-03',
    description: 'Date in YYYY-MM-DD format',
  })
  @IsDateOnly()
  invoiceDate!: string;

  @ApiProperty({
    example: '2026-07-03',
    description: 'Date in YYYY-MM-DD format. Must be on or after invoiceDate.',
  })
  @IsDateOnly()
  @IsDateOnOrAfter('invoiceDate', {
    message: 'dueDate must be on or after invoiceDate',
  })
  dueDate!: string;

  @ApiProperty({
    example: 'AUD',
    description: 'ISO 4217 currency code',
  })
  @Transform(({ value }) => trimUppercaseString(value))
  @IsIn(SUPPORTED_CURRENCIES)
  currency!: string;

  @ApiPropertyOptional({
    example: 'Invoice is issued to Kanglee',
  })
  @Transform(({ value }) => trimOptionalString(value))
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: CreateInvoiceItemDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateInvoiceItemDto)
  item!: CreateInvoiceItemDto;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  taxPercentage = 10;

  @ApiPropertyOptional({
    example: 20,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discount = 0;
}
