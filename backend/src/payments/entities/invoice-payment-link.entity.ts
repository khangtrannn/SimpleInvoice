import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { InvoiceEntity } from '../../invoices/entities/invoice.entity';

@Entity('invoice_payment_links')
export class InvoicePaymentLinkEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_invoice_payment_links',
  })
  id!: string;

  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId!: string;

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.paymentLinks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'invoice_id',
    foreignKeyConstraintName: 'fk_invoice_payment_links_invoice_id',
  })
  invoice!: InvoiceEntity;

  @Column({
    name: 'token_hash',
    type: 'varchar',
    length: 64,
  })
  tokenHash!: string;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
  })
  expiresAt!: Date;

  @Column({
    name: 'revoked_at',
    type: 'timestamptz',
    nullable: true,
  })
  revokedAt!: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt!: Date;
}
