import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { getTodayDateOnly } from '../common/utils/date.util';
import {
  GetInvoicesQueryDto,
  InvoiceSortBy,
} from './dto/get-invoices-query.dto';
import { InvoiceItemEntity } from './entities/invoice-item.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import {
  InvoiceEffectiveStatus,
  InvoiceStatus,
} from './enums/invoice-status.enum';

const SORT_COLUMN_MAP: Record<InvoiceSortBy, string> = {
  [InvoiceSortBy.CREATED_AT]: 'invoice.createdAt',
  [InvoiceSortBy.INVOICE_DATE]: 'invoice.invoiceDate',
  [InvoiceSortBy.DUE_DATE]: 'invoice.dueDate',
  [InvoiceSortBy.TOTAL_AMOUNT]: 'invoice.totalAmount',
};

export type FindAllInvoicesResult = {
  invoices: InvoiceEntity[];
  total: number;
};

export type InvoiceSummaryRaw = {
  totalRevenue: string;
  totalPaid: string;
  totalPending: string;
  totalOverdue: string;
  totalDraft: string;
  paidCount: string;
  pendingCount: string;
  overdueCount: string;
  draftCount: string;
  currency: string | null;
  currencySymbol: string | null;
  currencyCount: string;
};

export type DraftInvoiceData = {
  invoiceNumber: string;
  invoiceReference: string | null;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  currencySymbol: string;
  description: string | null;
  customerFullname: string;
  customerEmail: string;
  customerMobileNumber: string | null;
  customerAddress: string | null;
  invoiceSubTotal: string;
  taxPercentage: string;
  totalTax: string;
  totalDiscount: string;
  totalAmount: string;
  totalPaid: string;
  balanceAmount: string;
  createdById: string;
  item: {
    name: string;
    quantity: number;
    rate: string;
  };
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

    return { invoices, total };
  }

  async findSummary(query: GetInvoicesQueryDto): Promise<InvoiceSummaryRaw> {
    const qb = this.invoicesRepository
      .createQueryBuilder('invoice')
      .select('COALESCE(SUM(invoice.total_amount), 0)', 'totalRevenue')
      .addSelect(
        `COALESCE(SUM(CASE WHEN invoice.status = '${InvoiceStatus.PAID}' THEN invoice.total_amount ELSE 0 END), 0)`,
        'totalPaid',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN invoice.status = '${InvoiceStatus.PENDING}' AND invoice.due_date >= CURRENT_DATE THEN invoice.total_amount ELSE 0 END), 0)`,
        'totalPending',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN invoice.status != '${InvoiceStatus.PAID}' AND invoice.due_date < CURRENT_DATE THEN invoice.total_amount ELSE 0 END), 0)`,
        'totalOverdue',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN invoice.status = '${InvoiceStatus.DRAFT}' THEN invoice.total_amount ELSE 0 END), 0)`,
        'totalDraft',
      )
      .addSelect(
        `COUNT(CASE WHEN invoice.status = '${InvoiceStatus.PAID}' THEN 1 END)`,
        'paidCount',
      )
      .addSelect(
        `COUNT(CASE WHEN invoice.status = '${InvoiceStatus.PENDING}' AND invoice.due_date >= CURRENT_DATE THEN 1 END)`,
        'pendingCount',
      )
      .addSelect(
        `COUNT(CASE WHEN invoice.status != '${InvoiceStatus.PAID}' AND invoice.due_date < CURRENT_DATE THEN 1 END)`,
        'overdueCount',
      )
      .addSelect(
        `COUNT(CASE WHEN invoice.status = '${InvoiceStatus.DRAFT}' THEN 1 END)`,
        'draftCount',
      )
      .addSelect('MIN(invoice.currency)', 'currency')
      .addSelect('MIN(invoice.currency_symbol)', 'currencySymbol')
      .addSelect('COUNT(DISTINCT invoice.currency)', 'currencyCount');

    this.applyFilters(qb, query);

    return qb.getRawOne() as Promise<InvoiceSummaryRaw>;
  }

  findByIdWithItems(id: string): Promise<InvoiceEntity | null> {
    return this.invoicesRepository.findOne({
      where: { id },
      relations: {
        items: true,
      },
    });
  }

  createDraftInvoice(data: DraftInvoiceData): Promise<InvoiceEntity> {
    return this.dataSource.transaction((manager) =>
      this.persistDraftInvoice(manager, data),
    );
  }

  private buildFindAllQuery(
    query: GetInvoicesQueryDto,
  ): SelectQueryBuilder<InvoiceEntity> {
    const queryBuilder = this.invoicesRepository
      .createQueryBuilder('invoice')
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize);

    this.applyFilters(queryBuilder, query);
    this.applySorting(queryBuilder, query);

    return queryBuilder;
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<InvoiceEntity>,
    query: GetInvoicesQueryDto,
  ): void {
    const today = getTodayDateOnly();

    this.applyKeywordFilter(queryBuilder, query.keyword);
    this.applyDateRangeFilter(queryBuilder, query);

    if (query.status) {
      this.applyStatusFilter(queryBuilder, query.status, today);
    }
  }

  private applyKeywordFilter(
    queryBuilder: SelectQueryBuilder<InvoiceEntity>,
    keyword?: string,
  ): void {
    if (!keyword) {
      return;
    }

    queryBuilder.andWhere(
      '(invoice.invoice_number ILIKE :keyword OR invoice.customer_fullname ILIKE :keyword)',
      {
        keyword: `%${keyword}%`,
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
    queryBuilder.orderBy(SORT_COLUMN_MAP[query.sortBy], query.ordering);
  }

  private async persistDraftInvoice(
    manager: EntityManager,
    data: DraftInvoiceData,
  ): Promise<InvoiceEntity> {
    const { item, ...invoiceData } = data;
    const invoiceRepository = manager.getRepository(InvoiceEntity);
    const invoiceItemRepository = manager.getRepository(InvoiceItemEntity);

    const invoice = invoiceRepository.create({
      ...invoiceData,
      status: InvoiceStatus.DRAFT,
    });

    const persistedInvoice = await invoiceRepository.save(invoice);

    const invoiceItem = invoiceItemRepository.create({
      invoiceId: persistedInvoice.id,
      ...item,
    });

    const persistedItem = await invoiceItemRepository.save(invoiceItem);

    return { ...persistedInvoice, items: [persistedItem] };
  }
}
