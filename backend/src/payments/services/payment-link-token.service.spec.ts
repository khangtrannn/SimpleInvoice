import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PaymentLinkTokenService } from './payment-link-token.service';

describe(PaymentLinkTokenService.name, () => {
  let service: PaymentLinkTokenService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('http://localhost:5173'),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentLinkTokenService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PaymentLinkTokenService>(PaymentLinkTokenService);
    configService = module.get<jest.Mocked<ConfigService>>(ConfigService);
  });

  describe('generateRawToken', () => {
    it('should return a non-empty token', () => {
      // Act
      const token = service.generateRawToken();

      // Assert
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should return different tokens on each call', () => {
      // Act
      const token1 = service.generateRawToken();
      const token2 = service.generateRawToken();

      // Assert
      expect(token1).not.toBe(token2);
    });
  });

  describe('hashToken', () => {
    it('should return a 64-character hex string', () => {
      // Arrange
      const rawToken = 'test-token';

      // Act
      const hash = service.hashToken(rawToken);

      // Assert
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should return the same hash for the same input', () => {
      // Arrange
      const rawToken = 'test-token';

      // Act
      const hash1 = service.hashToken(rawToken);
      const hash2 = service.hashToken(rawToken);

      // Assert
      expect(hash1).toBe(hash2);
    });

    it('should return different hashes for different inputs', () => {
      // Act
      const hash1 = service.hashToken('token1');
      const hash2 = service.hashToken('token2');

      // Assert
      expect(hash1).not.toBe(hash2);
    });

    it('should not return the raw token as the hash', () => {
      // Arrange
      const rawToken = 'test-token';

      // Act
      const hash = service.hashToken(rawToken);

      // Assert
      expect(hash).not.toContain(rawToken);
    });
  });

  describe('buildPaymentUrl', () => {
    it('should build a payment URL with raw token', () => {
      // Arrange
      const rawToken = 'test-token-123';

      // Act
      const url = service.buildPaymentUrl(rawToken);

      // Assert
      expect(url).toBe(`http://localhost:5173/pay/${rawToken}`);
    });

    it('should remove trailing slash from APP_PUBLIC_URL', () => {
      // Arrange
      configService.getOrThrow.mockReturnValue('http://localhost:5173/');
      const rawToken = 'test-token-123';

      // Act
      const url = service.buildPaymentUrl(rawToken);

      // Assert
      expect(url).toBe(`http://localhost:5173/pay/${rawToken}`);
      expect(url).not.toContain('//pay');
    });

    it('should call configService.getOrThrow with APP_PUBLIC_URL', () => {
      // Arrange
      const rawToken = 'test-token';

      // Act
      service.buildPaymentUrl(rawToken);

      // Assert
      expect(configService.getOrThrow).toHaveBeenCalledWith('APP_PUBLIC_URL');
    });
  });
});
