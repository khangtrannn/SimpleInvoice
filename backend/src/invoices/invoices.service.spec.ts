import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { isUniqueViolation } from '../database/postgres-errors.util';
import type { AuthenticatedUser } from '../auth/types/authenticated-request.type';
import { EMAIL_SERVICE } from '../notifications/constants/notification-tokens';
import type { EmailService } from '../notifications/interfaces/email-service.interface';
import { PaymentLinkTokenService } from '../payments/services/payment-link-token.service';

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
import { InvoicePdfService } from './pdf/invoice-pdf.service';

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

    const mockDataSource = {
      transaction: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    const mockConfigService = {
      get: jest.fn().mockReturnValue('30'),
      getOrThrow: jest.fn().mockReturnValue('http://localhost:5173'),
    } as unknown as jest.Mocked<ConfigService>;

    const mockPaymentLinkTokenService = {
      generateRawToken: jest.fn(),
      hashToken: jest.fn(),
      buildPaymentUrl: jest.fn(),
    } as unknown as jest.Mocked<PaymentLinkTokenService>;

    const mockEmailService = {
      sendInvoiceIssuedEmail: jest.fn(),
    } as unknown as jest.Mocked<EmailService>;

    const mockInvoiceRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockInvoicePdfService = {
      generateInvoicePdf: jest.fn(),
    } as unknown as jest.Mocked<InvoicePdfService>;

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: InvoicesRepository,
          useValue: invoicesRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PaymentLinkTokenService,
          useValue: mockPaymentLinkTokenService,
        },
        {
          provide: EMAIL_SERVICE,
          useValue: mockEmailService,
        },
        {
          provide: getRepositoryToken(InvoiceEntity),
          useValue: mockInvoiceRepository,
        },
        {
          provide: InvoicePdfService,
          useValue: mockInvoicePdfService,
        },
      ],
    }).compile();

    invoicesService = moduleRef.get(InvoicesService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return mapped invoices with paging', async () => {
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

      // Act
      const result = await invoicesService.findAll(query);

      // Assert
      expect(invoicesRepository.findAll).toHaveBeenCalledWith(query);
      expect(invoicesRepository.findSummary).not.toHaveBeenCalled();
      expect(result.paging).toEqual({ page: 1, pageSize: 10, total: 1 });
      expect(result.data).toHaveLength(1);
      expect(result.data[0].invoiceNumber).toBe(mockInvoice.invoiceNumber);
      expect(result).not.toHaveProperty('summary');
    });
  });

  describe('findSummary', () => {
    it('should return the aggregated summary for the matching filters', async () => {
      // Arrange
      const query = {
        page: 1,
        pageSize: 10,
        sortBy: InvoiceSortBy.INVOICE_DATE,
        ordering: SortOrdering.DESC,
      } as GetInvoicesQueryDto;

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
      const result = await invoicesService.findSummary(query);

      // Assert
      expect(invoicesRepository.findSummary).toHaveBeenCalledWith(query);
      expect(invoicesRepository.findAll).not.toHaveBeenCalled();
      expect(result).toEqual({
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

  describe('issueInvoice', () => {
    let mockDataSource: jest.Mocked<DataSource>;
    let mockConfigService: jest.Mocked<ConfigService>;
    let mockPaymentLinkTokenService: jest.Mocked<PaymentLinkTokenService>;
    let mockEmailService: jest.Mocked<EmailService>;
    let mockInvoiceRepository: any;

    beforeEach(() => {
      const moduleRef = (invoicesService as any).constructor.prototype;
      mockDataSource = jest.fn() as any;
      mockConfigService = jest.fn() as any;
      mockPaymentLinkTokenService = jest.fn() as any;
      mockEmailService = jest.fn() as any;
      mockInvoiceRepository = jest.fn() as any;
    });

    it('should issue a draft invoice successfully', async () => {
      // Arrange
      const invoiceId = mockInvoice.id;
      const rawToken = 'raw-token-base64url';
      const tokenHash = 'sha256hash';
      const paymentUrl = 'http://localhost:5173/pay/raw-token-base64url';
      const pdfBuffer = Buffer.from('%PDF-1.4');

      const invoiceToIssue = {
        ...mockInvoice,
        status: InvoiceStatus.DRAFT,
        issuedAt: null,
        sentAt: null,
      };

      const updatedInvoice = {
        ...invoiceToIssue,
        status: InvoiceStatus.PENDING,
        issuedAt: expect.any(Date),
        sentAt: expect.any(Date),
      };

      // Setup mocks through the service's injected dependencies
      const dataSource = (invoicesService as any).dataSource;
      const configService = (invoicesService as any).configService;
      const paymentLinkTokenService = (invoicesService as any).paymentLinkTokenService;
      const emailService = (invoicesService as any).emailService;
      const invoiceRepository = (invoicesService as any).invoiceRepository;
      const invoicePdfService = (invoicesService as any).invoicePdfService;

      const invoiceRepo = {
        findOne: jest.fn().mockResolvedValue(invoiceToIssue),
        save: jest.fn().mockImplementation((invoice) => Promise.resolve({ ...invoice })),
      };

      const paymentLinkRepo = {
        create: jest.fn().mockReturnValue({}),
        save: jest.fn().mockResolvedValue({}),
      };

      dataSource.transaction = jest.fn().mockImplementation(async (cb) => {
        const mockManager = {
          getRepository: jest.fn().mockImplementation((Entity) => {
            if (Entity === InvoiceEntity) {
              return invoiceRepo;
            }
            return paymentLinkRepo;
          }),
        };
        return cb(mockManager);
      });

      paymentLinkTokenService.generateRawToken.mockReturnValue(rawToken);
      paymentLinkTokenService.hashToken.mockReturnValue(tokenHash);
      paymentLinkTokenService.buildPaymentUrl.mockReturnValue(paymentUrl);
      configService.get.mockReturnValue('30');
      invoicePdfService.generateInvoicePdf.mockResolvedValue(pdfBuffer);
      emailService.sendInvoiceIssuedEmail.mockResolvedValue(undefined);
      invoiceRepository.save.mockResolvedValue(updatedInvoice);

      // Act
      const result = await invoicesService.issueInvoice(invoiceId);

      // Assert
      expect(paymentLinkTokenService.generateRawToken).toHaveBeenCalled();
      expect(paymentLinkTokenService.hashToken).toHaveBeenCalledWith(rawToken);
      expect(paymentLinkTokenService.buildPaymentUrl).toHaveBeenCalledWith(rawToken);
      expect(invoicePdfService.generateInvoicePdf).toHaveBeenCalledWith(invoiceToIssue);
      expect(emailService.sendInvoiceIssuedEmail).toHaveBeenCalledWith({
        to: mockInvoice.customerEmail,
        customerFullname: mockInvoice.customerFullname,
        invoiceNumber: mockInvoice.invoiceNumber,
        paymentUrl,
        balanceAmount: mockInvoice.balanceAmount,
        currency: mockInvoice.currency,
        attachments: [
          {
            filename: `${mockInvoice.invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
      expect(result.status).toBe(InvoiceStatus.PENDING);
    });

    it('should throw NotFoundException when invoice does not exist', async () => {
      // Arrange
      const invoiceId = 'non-existent-id';
      const dataSource = (invoicesService as any).dataSource;

      dataSource.transaction = jest.fn().mockImplementation(async (cb) => {
        const mockManager = {
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockResolvedValue(null),
          }),
        };
        return cb(mockManager);
      });

      // Act & Assert
      await expect(invoicesService.issueInvoice(invoiceId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when invoice is not in Draft status', async () => {
      // Arrange
      const invoiceId = mockInvoice.id;
      const pendingInvoice = {
        ...mockInvoice,
        status: InvoiceStatus.PENDING,
      };

      const dataSource = (invoicesService as any).dataSource;
      dataSource.transaction = jest.fn().mockImplementation(async (cb) => {
        const mockManager = {
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockResolvedValue(pendingInvoice),
          }),
        };
        return cb(mockManager);
      });

      // Act & Assert
      await expect(invoicesService.issueInvoice(invoiceId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException when balance amount is zero or negative', async () => {
      // Arrange
      const invoiceId = mockInvoice.id;
      const zeroBalanceInvoice = {
        ...mockInvoice,
        status: InvoiceStatus.DRAFT,
        balanceAmount: '0.00',
      };

      const dataSource = (invoicesService as any).dataSource;
      dataSource.transaction = jest.fn().mockImplementation(async (cb) => {
        const mockManager = {
          getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockResolvedValue(zeroBalanceInvoice),
          }),
        };
        return cb(mockManager);
      });

      // Act & Assert
      await expect(invoicesService.issueInvoice(invoiceId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ServiceUnavailableException when email sending fails', async () => {
      // Arrange
      const invoiceId = mockInvoice.id;
      const rawToken = 'raw-token-base64url';
      const tokenHash = 'sha256hash';
      const paymentUrl = 'http://localhost:5173/pay/raw-token-base64url';
      const pdfBuffer = Buffer.from('%PDF-1.4');

      const invoiceToIssue = {
        ...mockInvoice,
        status: InvoiceStatus.DRAFT,
        issuedAt: null,
        sentAt: null,
        items: [mockInvoice.items[0]],
      };

      const dataSource = (invoicesService as any).dataSource;
      const configService = (invoicesService as any).configService;
      const paymentLinkTokenService = (invoicesService as any).paymentLinkTokenService;
      const emailService = (invoicesService as any).emailService;
      const invoicePdfService = (invoicesService as any).invoicePdfService;

      const invoiceRepo = {
        findOne: jest.fn().mockResolvedValue(invoiceToIssue),
        save: jest.fn().mockImplementation((invoice) => Promise.resolve({ ...invoice })),
      };

      const paymentLinkRepo = {
        create: jest.fn().mockReturnValue({}),
        save: jest.fn().mockResolvedValue({}),
      };

      dataSource.transaction = jest.fn().mockImplementation(async (cb) => {
        const mockManager = {
          getRepository: jest.fn().mockImplementation((Entity) => {
            if (Entity === InvoiceEntity) {
              return invoiceRepo;
            }
            return paymentLinkRepo;
          }),
        };
        return cb(mockManager);
      });

      paymentLinkTokenService.generateRawToken.mockReturnValue(rawToken);
      paymentLinkTokenService.hashToken.mockReturnValue(tokenHash);
      paymentLinkTokenService.buildPaymentUrl.mockReturnValue(paymentUrl);
      configService.get.mockReturnValue('30');
      invoicePdfService.generateInvoicePdf.mockResolvedValue(pdfBuffer);
      emailService.sendInvoiceIssuedEmail.mockRejectedValue(
        new Error('SMTP connection failed'),
      );

      // Act & Assert
      await expect(invoicesService.issueInvoice(invoiceId)).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
