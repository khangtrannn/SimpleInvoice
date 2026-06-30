import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoicePaymentLinkEntity } from './entities/invoice-payment-link.entity';
import { PaymentEntity } from './entities/payment.entity';
import { WebhookEventEntity } from './entities/webhook-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      InvoicePaymentLinkEntity,
      WebhookEventEntity,
    ]),
  ],
})
export class PaymentsModule {}
