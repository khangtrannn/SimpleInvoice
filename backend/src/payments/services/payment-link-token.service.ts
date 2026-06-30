import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class PaymentLinkTokenService {
  constructor(private readonly configService: ConfigService) {}

  generateRawToken(): string {
    return randomBytes(32).toString('base64url');
  }

  hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  buildPaymentUrl(rawToken: string): string {
    const appPublicUrl = this.configService.getOrThrow<string>('APP_PUBLIC_URL');

    return `${appPublicUrl.replace(/\/$/, '')}/pay/${rawToken}`;
  }
}
