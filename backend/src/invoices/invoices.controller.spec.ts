import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-request.type';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { GetInvoicesQueryDto } from './dto/get-invoices-query.dto';
import {
  InvoiceDetailResponseDto,
  InvoiceListResponseDto,
} from './dto/invoice-response.dto';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

describe(InvoicesController.name, () => {
  let invoicesController: InvoicesController;
  let invoicesService: jest.Mocked<
    Pick<InvoicesService, 'findAll' | 'findOne' | 'create'>
  >;

  beforeEach(async () => {
    invoicesService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: invoicesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    invoicesController = moduleRef.get(InvoicesController);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should delegate to invoicesService.findAll', async () => {
      // Arrange
      const query = {
        page: 1,
        pageSize: 10,
      } as GetInvoicesQueryDto;

      const response = {
        data: [],
        paging: { page: 1, pageSize: 10, total: 0 },
        summary: {
          totalRevenue: '0.00',
          totalPaid: '0.00',
          totalPending: '0.00',
          totalOverdue: '0.00',
          totalDraft: '0.00',
          paidCount: 0,
          pendingCount: 0,
          overdueCount: 0,
          draftCount: 0,
          currency: null,
          currencySymbol: null,
          currencyCount: 0,
        },
      } as InvoiceListResponseDto;

      invoicesService.findAll.mockResolvedValue(response);

      // Act
      const result = await invoicesController.findAll(query);

      // Assert
      expect(invoicesService.findAll).toHaveBeenCalledWith(query);
      expect(result).toBe(response);
    });
  });

  describe('findOne', () => {
    it('should delegate to invoicesService.findOne', async () => {
      // Arrange
      const invoiceId = 'ad1e0902-1928-4345-b513-60c86c94fc91';

      const response = {
        id: invoiceId,
        invoiceNumber: 'IV1780488206995',
      } as InvoiceDetailResponseDto;

      invoicesService.findOne.mockResolvedValue(response);

      // Act
      const result = await invoicesController.findOne(invoiceId);

      // Assert
      expect(invoicesService.findOne).toHaveBeenCalledWith(invoiceId);
      expect(result).toBe(response);
    });
  });

  describe('create', () => {
    it('should delegate to invoicesService.create with dto and current user', async () => {
      // Arrange
      const currentUser: AuthenticatedUser = {
        id: '8f9b6df8-9c6d-4f1e-a4ff-8b9c7a2f1001',
        email: 'reviewer@example.com',
        fullname: 'Reviewer',
      };

      const createInvoiceDto = {
        customerName: 'Paul Smith',
        customerEmail: 'paul@example.com',
        invoiceNumber: 'IV1780488206995',
        invoiceDate: '2026-06-03',
        dueDate: '2026-07-03',
        currency: 'AUD',
        item: {
          name: 'Website design',
          quantity: 2,
          rate: 100,
        },
        taxPercentage: 10,
        discount: 20,
      } as CreateInvoiceDto;

      const response = {
        id: 'ad1e0902-1928-4345-b513-60c86c94fc91',
        invoiceNumber: createInvoiceDto.invoiceNumber,
      } as InvoiceDetailResponseDto;

      invoicesService.create.mockResolvedValue(response);

      // Act
      const result = await invoicesController.create(
        createInvoiceDto,
        currentUser,
      );

      // Assert
      expect(invoicesService.create).toHaveBeenCalledWith(
        createInvoiceDto,
        currentUser,
      );
      expect(result).toBe(response);
    });
  });
});
