import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoicePaymentLinkEntity } from './entities/invoice-payment-link.entity';
import { PaymentEntity } from './entities/payment.entity';
import { WebhookEventEntity } from './entities/webhook-event.entity';
import { PaymentLinkTokenService } from './services/payment-link-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      InvoicePaymentLinkEntity,
      WebhookEventEntity,
    ]),
  ],
  providers: [PaymentLinkTokenService],
  exports: [
    TypeOrmModule,
    PaymentLinkTokenService,
  ],
})
export class PaymentsModule {}
