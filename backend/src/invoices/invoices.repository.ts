import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import type { AuthenticatedUser } from '../auth/types/authenticated-request.type';
import { getTodayDateOnly } from './domain/derive-invoice-status';
import type { InvoiceTotals } from './domain/invoice-calculation.types';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  GetInvoicesQueryDto,
  InvoiceSortBy,
  SortOrdering,
} from './dto/get-invoices-query.dto';
import { InvoiceItemEntity } from './entities/invoice-item.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import {
  InvoiceEffectiveStatus,
  InvoiceStatus,
} from './enums/invoice-status.enum';
import { getCurrencySymbol } from './utils/currency-symbol.util';

const SORT_COLUMN_MAP: Record<InvoiceSortBy, string> = {
  [InvoiceSortBy.INVOICE_DATE]: 'invoice.invoice_date',
  [InvoiceSortBy.DUE_DATE]: 'invoice.due_date',
  [InvoiceSortBy.TOTAL_AMOUNT]: 'invoice.total_amount',
};

export type FindAllInvoicesResult = {
  invoices: InvoiceEntity[];
  total: number;
};

@Injectable()
export class InvoicesRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(InvoiceEntity)
    private readonly invoicesRepository: Repository<InvoiceEntity>,
  ) {}

  async findAll(query: GetInvoicesQueryDto): Promise<FindAllInvoicesResult> {
    const queryBuilder = this.buildFindAllQuery(query);
    const [invoices, total] = await queryBuilder.getManyAndCount();

    return {
      invoices,
      total,
    };
  }

  findByIdWithItems(id: string): Promise<InvoiceEntity | null> {
    return this.invoicesRepository.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });
  }

  createDraftInvoice(
    createInvoiceDto: CreateInvoiceDto,
    currentUser: AuthenticatedUser,
    totals: InvoiceTotals,
  ): Promise<InvoiceEntity> {
    return this.dataSource.transaction((manager) =>
      this.persistDraftInvoice(manager, createInvoiceDto, currentUser, totals),
    );
  }

  private buildFindAllQuery(
    query: GetInvoicesQueryDto,
  ): SelectQueryBuilder<InvoiceEntity> {
    const queryBuilder = this.invoicesRepository
      .createQueryBuilder('invoice')
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize);

    this.applyKeywordFilter(queryBuilder, query.keyword);
    this.applyDateRangeFilter(queryBuilder, query);

    if (query.status) {
      this.applyStatusFilter(queryBuilder, query.status, getTodayDateOnly());
    }

    this.applySorting(queryBuilder, query);

    return queryBuilder;
  }

  private applyKeywordFilter(
    queryBuilder: SelectQueryBuilder<InvoiceEntity>,
    keyword?: string,
  ): void {
    const trimmedKeyword = keyword?.trim();

    if (!trimmedKeyword) {
      return;
    }

    queryBuilder.andWhere(
      '(invoice.invoice_number ILIKE :keyword OR invoice.customer_fullname ILIKE :keyword)',
      {
        keyword: `%${trimmedKeyword}%`,
      },
    );
  }

  private applyDateRangeFilter(
    queryBuilder: SelectQueryBuilder<InvoiceEntity>,
    query: GetInvoicesQueryDto,
  ): void {
    if (query.fromDate) {
      queryBuilder.andWhere('invoice.invoice_date >= :fromDate', {
        fromDate: query.fromDate,
      });
    }

    if (query.toDate) {
      queryBuilder.andWhere('invoice.invoice_date <= :toDate', {
        toDate: query.toDate,
      });
    }
  }

  private applyStatusFilter(
    queryBuilder: SelectQueryBuilder<InvoiceEntity>,
    status: InvoiceEffectiveStatus,
    today: string,
  ): void {
    if (status === InvoiceEffectiveStatus.OVERDUE) {
      queryBuilder.andWhere('invoice.status != :paidStatus', {
        paidStatus: InvoiceStatus.PAID,
      });
      queryBuilder.andWhere('invoice.due_date < :today', { today });
      return;
    }

    if (status === InvoiceEffectiveStatus.PAID) {
      queryBuilder.andWhere('invoice.status = :status', {
        status: InvoiceStatus.PAID,
      });
      return;
    }

    queryBuilder.andWhere('invoice.status = :status', { status });
    queryBuilder.andWhere('invoice.due_date >= :today', { today });
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<InvoiceEntity>,
    query: GetInvoicesQueryDto,
  ): void {
    queryBuilder.orderBy(
      SORT_COLUMN_MAP[query.sortBy],
      query.ordering as SortOrdering,
    );
  }

  private async persistDraftInvoice(
    manager: EntityManager,
    createInvoiceDto: CreateInvoiceDto,
    currentUser: AuthenticatedUser,
    totals: InvoiceTotals,
  ): Promise<InvoiceEntity> {
    const invoiceRepository = manager.getRepository(InvoiceEntity);
    const invoiceItemRepository = manager.getRepository(InvoiceItemEntity);

    const invoice = invoiceRepository.create({
      invoiceNumber: createInvoiceDto.invoiceNumber,
      invoiceReference: createInvoiceDto.invoiceReference ?? null,
      invoiceDate: createInvoiceDto.invoiceDate,
      dueDate: createInvoiceDto.dueDate,
      currency: createInvoiceDto.currency,
      currencySymbol: getCurrencySymbol(createInvoiceDto.currency),
      description: createInvoiceDto.description ?? null,
      status: InvoiceStatus.DRAFT,

      customerFullname: createInvoiceDto.customerName,
      customerEmail: createInvoiceDto.customerEmail,
      customerMobileNumber: createInvoiceDto.customerMobile ?? null,
      customerAddress: createInvoiceDto.customerAddress ?? null,

      invoiceSubTotal: totals.invoiceSubTotal,
      taxPercentage: createInvoiceDto.taxPercentage.toFixed(2),
      totalTax: totals.totalTax,
      totalDiscount: totals.totalDiscount,
      totalAmount: totals.totalAmount,
      totalPaid: totals.totalPaid,
      balanceAmount: totals.balanceAmount,

      createdById: currentUser.id,
    });

    const persistedInvoice = await invoiceRepository.save(invoice);

    const invoiceItem = invoiceItemRepository.create({
      invoiceId: persistedInvoice.id,
      name: createInvoiceDto.item.name,
      quantity: createInvoiceDto.item.quantity,
      rate: createInvoiceDto.item.rate.toFixed(2),
    });

    await invoiceItemRepository.save(invoiceItem);

    return invoiceRepository.findOneOrFail({
      where: { id: persistedInvoice.id },
      relations: {
        items: true,
      },
    });
  }
}
