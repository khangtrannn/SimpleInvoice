import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { InvoiceEntity } from './invoice.entity';

@Entity({ name: 'invoice_items' })
@Check('chk_invoice_items_quantity_positive', '"quantity" > 0')
@Check('chk_invoice_items_rate_positive', '"rate" > 0')
export class InvoiceItemEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_invoice_items',
  })
  id!: string;

  @Column({
    name: 'invoice_id',
    type: 'uuid',
  })
  invoiceId!: string;

  @ManyToOne(() => InvoiceEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'invoice_id',
    foreignKeyConstraintName: 'fk_invoice_items_invoice_id_invoices_id',
  })
  invoice!: InvoiceEntity;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name!: string;

  @Column({
    name: 'quantity',
    type: 'integer',
  })
  quantity!: number;

  @Column({
    name: 'rate',
    type: 'numeric',
    precision: 14,
    scale: 2,
  })
  rate!: string;
}
