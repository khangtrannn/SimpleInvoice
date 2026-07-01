import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nodemailer from 'nodemailer';
import { GmailEmailService } from './gmail-email.service';

jest.mock('nodemailer');

describe(GmailEmailService.name, () => {
  let service: GmailEmailService;
  let configService: jest.Mocked<ConfigService>;
  let mockTransporter: any;

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'GMAIL_USER') return 'test@gmail.com';
        if (key === 'GMAIL_APP_PASSWORD') return 'test-app-password';
        throw new Error(`Config not found: ${key}`);
      }),
      get: jest.fn((key: string) => {
        if (key === 'GMAIL_FROM_NAME') return 'SimpleInvoice';
        if (key === 'GMAIL_FROM_EMAIL') return 'noreply@example.com';
        return null;
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GmailEmailService,
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<GmailEmailService>(GmailEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendInvoiceIssuedEmail', () => {
    it('should send email with invoice details', async () => {
      // Arrange
      const emailInput = {
        to: 'customer@example.com',
        customerFullname: 'John Doe',
        invoiceNumber: 'INV-001',
        paymentUrl: 'http://localhost:3000/pay/token',
        balanceAmount: '1000.00',
        currency: 'AUD',
      };

      // Act
      await service.sendInvoiceIssuedEmail(emailInput);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: '"SimpleInvoice" <noreply@example.com>',
          to: emailInput.to,
          subject: `Invoice ${emailInput.invoiceNumber} from SimpleInvoice`,
          text: expect.stringContaining(emailInput.customerFullname),
          html: expect.stringContaining('Pay invoice'),
        }),
      );
    });

    it('should include payment URL in email', async () => {
      // Arrange
      const paymentUrl = 'http://localhost:3000/pay/test-token';
      const emailInput = {
        to: 'customer@example.com',
        customerFullname: 'John Doe',
        invoiceNumber: 'INV-001',
        paymentUrl,
        balanceAmount: '1000.00',
        currency: 'AUD',
      };

      // Act
      await service.sendInvoiceIssuedEmail(emailInput);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining(paymentUrl),
          html: expect.stringContaining(paymentUrl),
        }),
      );
    });

    it('should attach PDF when provided', async () => {
      // Arrange
      const pdfBuffer = Buffer.from('%PDF-1.4...');
      const emailInput = {
        to: 'customer@example.com',
        customerFullname: 'John Doe',
        invoiceNumber: 'INV-001',
        paymentUrl: 'http://localhost:3000/pay/token',
        balanceAmount: '1000.00',
        currency: 'AUD',
        attachments: [
          {
            filename: 'INV-001.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      // Act
      await service.sendInvoiceIssuedEmail(emailInput);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: [
            {
              filename: 'INV-001.pdf',
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        }),
      );
    });

    it('should escape HTML special characters in email body', async () => {
      // Arrange
      const emailInput = {
        to: 'customer@example.com',
        customerFullname: 'John <Script> Doe',
        invoiceNumber: 'INV-001',
        paymentUrl: 'http://localhost:3000/pay/token',
        balanceAmount: '1000.00',
        currency: 'AUD',
      };

      // Act
      await service.sendInvoiceIssuedEmail(emailInput);

      // Assert
      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain('John &lt;Script&gt; Doe');
      expect(call.html).not.toContain('John <Script> Doe');
    });

    it('should use default from email if GMAIL_FROM_EMAIL not configured', async () => {
      // Arrange
      (configService.get as jest.Mock).mockImplementation((key: string) => {
        if (key === 'GMAIL_FROM_NAME') return 'SimpleInvoice';
        if (key === 'GMAIL_FROM_EMAIL') return null;
        return null;
      });

      const emailInput = {
        to: 'customer@example.com',
        customerFullname: 'John Doe',
        invoiceNumber: 'INV-001',
        paymentUrl: 'http://localhost:3000/pay/token',
        balanceAmount: '1000.00',
        currency: 'AUD',
      };

      // Act
      await service.sendInvoiceIssuedEmail(emailInput);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: '"SimpleInvoice" <test@gmail.com>',
        }),
      );
    });
  });
});
