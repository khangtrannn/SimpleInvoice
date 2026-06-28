import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { isUniqueViolation } from '../database/postgres-errors.util';
import type { AuthenticatedUser } from '../auth/types/authenticated-request.type';

jest.mock('../database/postgres-errors.util');
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  GetInvoicesQueryDto,
  InvoiceSortBy,
  SortOrdering,
} from './dto/get-invoices-query.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceStatus } from './enums/invoice-status.enum';
import { InvoicesRepository } from './invoices.repository';
import { InvoicesService } from './invoices.service';

describe(InvoicesService.name, () => {
  let invoicesService: InvoicesService;
  let invoicesRepository: jest.Mocked<
    Pick<
      InvoicesRepository,
      'findAll' | 'findSummary' | 'findByIdWithItems' | 'createDraftInvoice'
    >
  >;

  const currentUser: AuthenticatedUser = {
    id: '8f9b6df8-9c6d-4f1e-a4ff-8b9c7a2f1001',
    email: 'reviewer@example.com',
    fullname: 'Reviewer',
  };

  const createInvoiceDto: CreateInvoiceDto = {
    customerName: 'Paul Smith',
    customerEmail: 'paul@example.com',
    customerMobile: '+61412345678',
    customerAddress: 'Sydney, Australia',
    invoiceNumber: 'IV1780488206995',
    invoiceReference: 'REF-001',
    invoiceDate: '2026-06-03',
    dueDate: '2026-07-03',
    currency: 'AUD',
    description: 'Website design invoice',
    item: {
      name: 'Website design',
      quantity: 2,
      rate: 100,
    },
    taxPercentage: 10,
    discount: 20,
  };

  const mockInvoice = {
    id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
    invoiceNumber: createInvoiceDto.invoiceNumber,
    invoiceReference: createInvoiceDto.invoiceReference,
    invoiceDate: createInvoiceDto.invoiceDate,
    dueDate: createInvoiceDto.dueDate,
    currency: 'AUD',
    currencySymbol: '$',
    description: createInvoiceDto.description,
    status: InvoiceStatus.DRAFT,

    customerFullname: createInvoiceDto.customerName,
    customerEmail: createInvoiceDto.customerEmail,
    customerMobileNumber: createInvoiceDto.customerMobile,
    customerAddress: createInvoiceDto.customerAddress,

    invoiceSubTotal: '200.00',
    taxPercentage: '10.00',
    totalTax: '20.00',
    totalDiscount: '20.00',
    totalAmount: '200.00',
    totalPaid: '0.00',
    balanceAmount: '200.00',

    createdById: currentUser.id,
    createdAt: new Date('2026-06-03T00:00:00.000Z'),
    updatedAt: new Date('2026-06-03T00:00:00.000Z'),

    items: [
      {
        id: 'b3e7d6c0-4d82-4f4a-9e54-81e1f4f8c111',
        name: 'Website design',
        quantity: 2,
        rate: '100.00',
      },
    ],
  } as unknown as InvoiceEntity;

  beforeEach(async () => {
    invoicesRepository = {
      findAll: jest.fn(),
      findSummary: jest.fn(),
      findByIdWithItems: jest.fn(),
      createDraftInvoice: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: InvoicesRepository,
          useValue: invoicesRepository,
        },
      ],
    }).compile();

    invoicesService = moduleRef.get(InvoicesService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return mapped invoices with paging and summary', async () => {
      // Arrange
      const query = {
        page: 1,
        pageSize: 10,
        sortBy: InvoiceSortBy.INVOICE_DATE,
        ordering: SortOrdering.DESC,
      } as GetInvoicesQueryDto;

      invoicesRepository.findAll.mockResolvedValue({
        invoices: [mockInvoice],
        total: 1,
      });

      invoicesRepository.findSummary.mockResolvedValue({
        totalRevenue: '200.00',
        totalPaid: '0.00',
        totalPending: '0.00',
        totalOverdue: '0.00',
        totalDraft: '200.00',
        paidCount: '0',
        pendingCount: '0',
        overdueCount: '0',
        draftCount: '1',
        currency: 'AUD',
        currencySymbol: '$',
        currencyCount: '1',
      });

      // Act
      const result = await invoicesService.findAll(query);

      // Assert
      expect(invoicesRepository.findAll).toHaveBeenCalledWith(query);
      expect(invoicesRepository.findSummary).toHaveBeenCalledWith(query);
      expect(result.paging).toEqual({ page: 1, pageSize: 10, total: 1 });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].invoiceNumber).toBe(mockInvoice.invoiceNumber);
      expect(result.summary).toEqual({
        totalRevenue: '200.00',
        totalPaid: '0.00',
        totalPending: '0.00',
        totalOverdue: '0.00',
        totalDraft: '200.00',
        paidCount: 0,
        pendingCount: 0,
        overdueCount: 0,
        draftCount: 1,
        currency: 'AUD',
        currencySymbol: '$',
        currencyCount: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return invoice detail when invoice exists', async () => {
      // Arrange
      invoicesRepository.findByIdWithItems.mockResolvedValue(mockInvoice);

      // Act
      const result = await invoicesService.findOne(mockInvoice.id);

      // Assert
      expect(invoicesRepository.findByIdWithItems).toHaveBeenCalledWith(
        mockInvoice.id,
      );
      expect(result.id).toBe(mockInvoice.id);
      expect(result.invoiceNumber).toBe(mockInvoice.invoiceNumber);
    });

    it('should throw NotFoundException when invoice does not exist', async () => {
      // Arrange
      invoicesRepository.findByIdWithItems.mockResolvedValue(null);

      // Act
      const act = invoicesService.findOne(mockInvoice.id);

      // Assert
      await expect(act).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should calculate totals and create a draft invoice', async () => {
      // Arrange
      invoicesRepository.createDraftInvoice.mockResolvedValue(mockInvoice);

      // Act
      const result = await invoicesService.create(
        createInvoiceDto,
        currentUser,
      );

      // Assert
      expect(invoicesRepository.createDraftInvoice).toHaveBeenCalledWith({
        invoiceNumber: createInvoiceDto.invoiceNumber,
        invoiceReference: createInvoiceDto.invoiceReference,
        invoiceDate: createInvoiceDto.invoiceDate,
        dueDate: createInvoiceDto.dueDate,
        currency: createInvoiceDto.currency,
        currencySymbol: 'AU$',
        description: createInvoiceDto.description,
        customerFullname: createInvoiceDto.customerName,
        customerEmail: createInvoiceDto.customerEmail,
        customerMobileNumber: createInvoiceDto.customerMobile,
        customerAddress: createInvoiceDto.customerAddress,
        taxPercentage: '10.00',
        invoiceSubTotal: '200.00',
        totalTax: '20.00',
        totalDiscount: '20.00',
        totalAmount: '200.00',
        totalPaid: '0.00',
        balanceAmount: '200.00',
        createdById: currentUser.id,
        item: {
          name: createInvoiceDto.item.name,
          quantity: createInvoiceDto.item.quantity,
          rate: '100.00',
        },
      });
      expect(result.id).toBe(mockInvoice.id);
      expect(result.invoiceNumber).toBe(mockInvoice.invoiceNumber);
    });

    it('should throw ConflictException when invoice number already exists', async () => {
      // Arrange
      const duplicateError = new Error('duplicate invoice number');

      invoicesRepository.createDraftInvoice.mockRejectedValue(duplicateError);
      jest.mocked(isUniqueViolation).mockReturnValue(true);

      // Act
      const act = invoicesService.create(createInvoiceDto, currentUser);

      // Assert
      await expect(act).rejects.toThrow(ConflictException);
      expect(isUniqueViolation).toHaveBeenCalledWith(
        duplicateError,
        'uq_invoices_invoice_number',
      );
    });

    it('should rethrow unexpected repository errors', async () => {
      // Arrange
      const unexpectedError = new Error('database unavailable');

      invoicesRepository.createDraftInvoice.mockRejectedValue(unexpectedError);
      jest.mocked(isUniqueViolation).mockReturnValue(false);

      // Act
      const act = invoicesService.create(createInvoiceDto, currentUser);

      // Assert
      await expect(act).rejects.toThrow(unexpectedError);
    });

    it('should throw BadRequestException when calculated totals are invalid', async () => {
      // Arrange
      const invalidDto: CreateInvoiceDto = {
        ...createInvoiceDto,
        discount: 221,
      };

      // Act
      const act = invoicesService.create(invalidDto, currentUser);

      // Assert
      await expect(act).rejects.toThrow(BadRequestException);
      expect(invoicesRepository.createDraftInvoice).not.toHaveBeenCalled();
    });
  });
});
