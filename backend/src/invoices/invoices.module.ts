import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';
import { IsDateOnlyConstraint } from '../common/validators/is-date-only.validator';
import { IsDateOnOrAfterConstraint } from '../common/validators/is-date-on-or-after.validator';
import { IsDateRangeConstraint } from '../common/validators/is-date-range.validator';
import { InvoiceItemEntity } from './entities/invoice-item.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesRepository } from './invoices.repository';
import { InvoicesService } from './invoices.service';
import { InvoicePdfService } from './pdf/invoice-pdf.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([InvoiceEntity, InvoiceItemEntity]),
    PaymentsModule,
    NotificationsModule,
  ],
  controllers: [InvoicesController],
  providers: [
    InvoicesRepository,
    InvoicesService,
    InvoicePdfService,
    IsDateOnlyConstraint,
    IsDateOnOrAfterConstraint,
    IsDateRangeConstraint,
  ],
})
export class InvoicesModule {}
