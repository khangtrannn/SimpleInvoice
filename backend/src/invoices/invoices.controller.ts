import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request.type';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { GetInvoicesQueryDto } from './dto/get-invoices-query.dto';
import {
  InvoiceDetailResponseDto,
  InvoiceListResponseDto,
} from './dto/invoice-response.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({
    summary: 'List invoices with search, filter, sort, and pagination',
  })
  @ApiOkResponse({
    type: InvoiceListResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  findAll(
    @Query() query: GetInvoicesQueryDto,
  ): Promise<InvoiceListResponseDto> {
    return this.invoicesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get invoice detail by ID',
  })
  @ApiOkResponse({
    type: InvoiceDetailResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Invoice not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<InvoiceDetailResponseDto> {
    return this.invoicesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new draft invoice',
  })
  @ApiCreatedResponse({
    type: InvoiceDetailResponseDto,
  })
  @ApiConflictResponse({
    description: 'Invoice number already exists',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<InvoiceDetailResponseDto> {
    return this.invoicesService.create(createInvoiceDto, currentUser);
  }
}
