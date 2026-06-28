import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { isUniqueViolation } from '../database/postgres-errors.util';
import { AuthenticatedUser } from '../auth/types/authenticated-request.type';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { GetInvoicesQueryDto } from './dto/get-invoices-query.dto';
import {
  InvoiceDetailResponseDto,
  InvoiceListResponseDto,
  InvoiceSummaryResponseDto,
} from './dto/invoice-response.dto';
import {
  calculateInvoiceTotals,
  InvoiceCalculationError,
  toMoney,
} from './domain/invoice-calculation';
import type { InvoiceTotals } from './domain/invoice-calculation.types';
import {
  DraftInvoiceData,
  InvoiceSummaryRaw,
  InvoicesRepository,
} from './invoices.repository';
import {
  toInvoiceDetailResponse,
  toInvoiceListItemResponse,
} from './mappers/invoice-response.mapper';
import { getCurrencySymbol } from './utils/currency-symbol.util';

const INVOICE_NUMBER_UNIQUE_CONSTRAINT = 'uq_invoices_invoice_number';

@Injectable()
export class InvoicesService {
  constructor(private readonly invoicesRepository: InvoicesRepository) {}

  async findAll(query: GetInvoicesQueryDto): Promise<InvoiceListResponseDto> {
    const [{ invoices, total }, summaryRaw] = await Promise.all([
      this.invoicesRepository.findAll(query),
      this.invoicesRepository.findSummary(query),
    ]);

    return {
      data: invoices.map(toInvoiceListItemResponse),
      paging: {
        page: query.page,
        pageSize: query.pageSize,
        total,
      },
      summary: this.toSummaryDto(summaryRaw),
    };
  }

  private toSummaryDto(raw: InvoiceSummaryRaw): InvoiceSummaryResponseDto {
    return {
      totalRevenue: raw.totalRevenue,
      totalPaid: raw.totalPaid,
      totalPending: raw.totalPending,
      totalOverdue: raw.totalOverdue,
      totalDraft: raw.totalDraft,
      paidCount: Number(raw.paidCount),
      pendingCount: Number(raw.pendingCount),
      overdueCount: Number(raw.overdueCount),
      draftCount: Number(raw.draftCount),
      currency: raw.currency,
      currencySymbol: raw.currencySymbol,
      currencyCount: Number(raw.currencyCount),
    };
  }

  async findOne(id: string): Promise<InvoiceDetailResponseDto> {
    const invoice = await this.invoicesRepository.findByIdWithItems(id);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return toInvoiceDetailResponse(invoice);
  }

  async create(
    createInvoiceDto: CreateInvoiceDto,
    currentUser: AuthenticatedUser,
  ): Promise<InvoiceDetailResponseDto> {
    const totals = this.calculateTotals(createInvoiceDto);
    const data = this.buildDraftInvoiceData(
      createInvoiceDto,
      currentUser.id,
      totals,
    );

    try {
      const savedInvoice =
        await this.invoicesRepository.createDraftInvoice(data);
      return toInvoiceDetailResponse(savedInvoice);
    } catch (error) {
      if (isUniqueViolation(error, INVOICE_NUMBER_UNIQUE_CONSTRAINT)) {
        throw new ConflictException('Invoice number already exists');
      }

      throw error;
    }
  }

  private calculateTotals(createInvoiceDto: CreateInvoiceDto): InvoiceTotals {
    try {
      return calculateInvoiceTotals({
        quantity: createInvoiceDto.item.quantity,
        rate: createInvoiceDto.item.rate,
        taxPercentage: createInvoiceDto.taxPercentage,
        discount: createInvoiceDto.discount,
        totalPaid: 0,
      });
    } catch (error) {
      if (error instanceof InvoiceCalculationError) {
        throw new BadRequestException([error.message]);
      }

      throw error;
    }
  }

  private buildDraftInvoiceData(
    dto: CreateInvoiceDto,
    createdById: string,
    totals: InvoiceTotals,
  ): DraftInvoiceData {
    return {
      invoiceNumber: dto.invoiceNumber,
      invoiceReference: dto.invoiceReference ?? null,
      invoiceDate: dto.invoiceDate,
      dueDate: dto.dueDate,
      currency: dto.currency,
      currencySymbol: getCurrencySymbol(dto.currency),
      description: dto.description ?? null,
      customerFullname: dto.customerName,
      customerEmail: dto.customerEmail,
      customerMobileNumber: dto.customerMobile ?? null,
      customerAddress: dto.customerAddress ?? null,
      taxPercentage: toMoney(dto.taxPercentage),
      ...totals,
      createdById,
      item: {
        name: dto.item.name,
        quantity: dto.item.quantity,
        rate: toMoney(dto.item.rate),
      },
    };
  }
}
