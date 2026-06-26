import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceItemEntity } from './entities/invoice-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity, InvoiceItemEntity])],
  exports: [TypeOrmModule],
})
export class InvoicesModule {}