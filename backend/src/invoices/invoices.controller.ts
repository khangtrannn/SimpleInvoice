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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ErrorResponseDto } from '../common/dto/error-response.dto';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-request.type';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { GetInvoicesQueryDto } from './dto/get-invoices-query.dto';
import {
  InvoiceDetailResponseDto,
  InvoiceListResponseDto,
  InvoiceSummaryResponseDto,
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
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Invalid query parameters',
  })
  findAll(
    @Query() query: GetInvoicesQueryDto,
  ): Promise<InvoiceListResponseDto> {
    return this.invoicesService.findAll(query);
  }

  @Get('summary')
  @ApiOperation({
    summary:
      'Aggregated invoice totals and counts by status. Respects the same filters as GET /invoices.',
  })
  @ApiOkResponse({
    type: InvoiceSummaryResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Invalid query parameters',
  })
  findSummary(
    @Query() query: GetInvoicesQueryDto,
  ): Promise<InvoiceSummaryResponseDto> {
    return this.invoicesService.findSummary(query);
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
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Validation error',
  })
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<InvoiceDetailResponseDto> {
    return this.invoicesService.create(createInvoiceDto, currentUser);
  }

  @Post(':id/issue')
  @ApiOperation({
    summary: 'Issue a draft invoice',
  })
  @ApiOkResponse({
    type: InvoiceDetailResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Invoice not found',
  })
  @ApiConflictResponse({
    description: 'Only draft invoices can be issued',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Invoice balance amount must be greater than zero',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired access token',
  })
  issueInvoice(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<InvoiceDetailResponseDto> {
    return this.invoicesService.issueInvoice(id);
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
}
