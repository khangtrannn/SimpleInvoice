import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { IsDateOnlyConstraint } from '../common/validators/is-date-only.validator';
import { IsDateOnOrAfterConstraint } from '../common/validators/is-date-on-or-after.validator';
import { IsDateRangeConstraint } from '../common/validators/is-date-range.validator';
import { InvoiceItemEntity } from './entities/invoice-item.entity';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoicesController } from './invoices.controller';
import { InvoicesRepository } from './invoices.repository';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([InvoiceEntity, InvoiceItemEntity]),
  ],
  controllers: [InvoicesController],
  providers: [
    InvoicesRepository,
    InvoicesService,
    IsDateOnlyConstraint,
    IsDateOnOrAfterConstraint,
    IsDateRangeConstraint,
  ],
})
export class InvoicesModule {}
