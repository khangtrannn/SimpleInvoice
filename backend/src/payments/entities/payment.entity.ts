import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { InvoiceEntity } from '../../invoices/entities/invoice.entity';
import { PaymentProvider } from '../enums/payment-provider.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity('payments')
@Check(`"amount" > 0`)
@Check(`char_length("currency") = 3`)
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_payments',
  })
  id!: string;

  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId!: string;

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.payments, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'invoice_id',
    foreignKeyConstraintName: 'fk_payments_invoice_id',
  })
  invoice!: InvoiceEntity;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
  })
  amount!: string;

  @Column({
    type: 'varchar',
    length: 3,
  })
  currency!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    enumName: 'payment_status_enum',
    default: PaymentStatus.Pending,
  })
  status!: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
    enumName: 'payment_provider_enum',
  })
  provider!: PaymentProvider;

  @Column({
    name: 'stripe_checkout_session_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  stripeCheckoutSessionId!: string | null;

  @Column({
    name: 'stripe_payment_intent_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  stripePaymentIntentId!: string | null;

  @Column({
    name: 'failure_reason',
    type: 'text',
    nullable: true,
  })
  failureReason!: string | null;

  @Column({
    name: 'paid_at',
    type: 'timestamptz',
    nullable: true,
  })
  paidAt!: Date | null;

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
