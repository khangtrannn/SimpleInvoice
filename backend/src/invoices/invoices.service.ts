import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { Repository } from 'typeorm';

import { isUniqueViolation } from '../database/postgres-errors.util';
import { AuthenticatedUser } from '../auth/types/authenticated-request.type';
import { EMAIL_SERVICE } from '../notifications/constants/notification-tokens';
import type { EmailService } from '../notifications/interfaces/email-service.interface';
import { InvoicePaymentLinkEntity } from '../payments/entities/invoice-payment-link.entity';
import { PaymentLinkTokenService } from '../payments/services/payment-link-token.service';
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
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceStatus } from './enums/invoice-status.enum';

const INVOICE_NUMBER_UNIQUE_CONSTRAINT = 'uq_invoices_invoice_number';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly paymentLinkTokenService: PaymentLinkTokenService,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: EmailService,
    private readonly invoicesRepository: InvoicesRepository,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {}

  async findAll(query: GetInvoicesQueryDto): Promise<InvoiceListResponseDto> {
    const { invoices, total } = await this.invoicesRepository.findAll(query);

    return {
      data: invoices.map(toInvoiceListItemResponse),
      paging: {
        page: query.page,
        pageSize: query.pageSize,
        total,
      },
    };
  }

  async findSummary(
    query: GetInvoicesQueryDto,
  ): Promise<InvoiceSummaryResponseDto> {
    const summaryRaw = await this.invoicesRepository.findSummary(query);
    return this.toSummaryDto(summaryRaw);
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

  async issueInvoice(invoiceId: string): Promise<InvoiceDetailResponseDto> {
    const now = new Date();

    const rawToken = this.paymentLinkTokenService.generateRawToken();
    const tokenHash = this.paymentLinkTokenService.hashToken(rawToken);
    const paymentUrl = this.paymentLinkTokenService.buildPaymentUrl(rawToken);
    const expiresAt = this.getPaymentLinkExpiresAt(now);

    const issuedInvoice = await this.dataSource.transaction(async (manager) => {
      const invoiceRepository = manager.getRepository(InvoiceEntity);
      const paymentLinkRepository = manager.getRepository(InvoicePaymentLinkEntity);

      const invoice = await invoiceRepository.findOne({
        where: { id: invoiceId },
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      if (invoice.status !== InvoiceStatus.DRAFT) {
        throw new ConflictException('Only draft invoices can be issued');
      }

      if (Number(invoice.balanceAmount) <= 0) {
        throw new BadRequestException(
          'Invoice balance amount must be greater than zero',
        );
      }

      invoice.status = InvoiceStatus.PENDING;
      invoice.issuedAt = now;

      await invoiceRepository.save(invoice);

      const paymentLink = paymentLinkRepository.create({
        invoiceId: invoice.id,
        tokenHash,
        expiresAt,
        revokedAt: null,
      });

      await paymentLinkRepository.save(paymentLink);

      return invoice;
    });

    await this.emailService.sendInvoiceIssuedEmail({
      to: issuedInvoice.customerEmail,
      customerFullname: issuedInvoice.customerFullname,
      invoiceNumber: issuedInvoice.invoiceNumber,
      paymentUrl,
      balanceAmount: String(issuedInvoice.balanceAmount),
      currency: issuedInvoice.currency,
    });

    issuedInvoice.sentAt = new Date();
    const savedInvoice = await this.invoiceRepository.save(issuedInvoice);

    return toInvoiceDetailResponse(savedInvoice);
  }

  private getPaymentLinkExpiresAt(now: Date): Date {
    const rawValue =
      this.configService.get<string>('PAYMENT_LINK_EXPIRES_IN_DAYS') ?? '30';

    const expiresInDays = Number(rawValue);

    if (!Number.isInteger(expiresInDays) || expiresInDays <= 0) {
      throw new Error('PAYMENT_LINK_EXPIRES_IN_DAYS must be a positive integer');
    }

    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return expiresAt;
  }
}
