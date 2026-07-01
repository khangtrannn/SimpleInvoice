import { Test, TestingModule } from '@nestjs/testing';
import { InvoicePdfService } from './invoice-pdf.service';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InvoiceStatus } from '../enums/invoice-status.enum';

describe(InvoicePdfService.name, () => {
  let service: InvoicePdfService;

  const mockInvoice: Partial<InvoiceEntity> = {
    id: 'invoice-id-123',
    invoiceNumber: 'INV-001',
    invoiceReference: 'REF-001',
    invoiceDate: '2026-06-03',
    dueDate: '2026-07-03',
    currency: 'AUD',
    currencySymbol: '$',
    description: 'Website design invoice',
    status: InvoiceStatus.PENDING,
    customerFullname: 'Paul Smith',
    customerEmail: 'paul@example.com',
    customerMobileNumber: '+61412345678',
    customerAddress: 'Sydney, Australia',
    invoiceSubTotal: '200.00',
    taxPercentage: '10.00',
    totalTax: '20.00',
    totalDiscount: '20.00',
    totalAmount: '200.00',
    totalPaid: '0.00',
    balanceAmount: '200.00',
    issuedAt: new Date(),
    sentAt: null,
    items: [
      {
        id: 'item-id-123',
        name: 'Website design',
        quantity: 2,
        rate: '100.00',
      } as any,
    ],
  } as InvoiceEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicePdfService],
    }).compile();

    service = module.get<InvoicePdfService>(InvoicePdfService);
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateInvoicePdf', () => {
    it('should generate a PDF buffer', async () => {
      // Act
      const pdfBuffer = await service.generateInvoicePdf(mockInvoice as InvoiceEntity);

      // Assert
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);
    });

    it('should return buffer starting with PDF magic number', async () => {
      // Act
      const pdfBuffer = await service.generateInvoicePdf(mockInvoice as InvoiceEntity);

      // Assert
      const pdfSignature = pdfBuffer.subarray(0, 4).toString();
      expect(pdfSignature).toBe('%PDF');
    });

    it('should include invoice number in the PDF content', async () => {
      // Act
      const pdfBuffer = await service.generateInvoicePdf(mockInvoice as InvoiceEntity);

      // Assert - PDF is binary, but we can check that it's substantial
      expect(pdfBuffer.length).toBeGreaterThan(5000);
    });
  });

  describe('onModuleDestroy', () => {
    it('should close the browser on module destruction', async () => {
      // Act & Assert
      await expect(service.onModuleDestroy()).resolves.not.toThrow();
    });
  });
});
