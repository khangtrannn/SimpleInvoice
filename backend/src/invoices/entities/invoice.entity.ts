import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { UserEntity } from '../../users/entities/user.entity';
import { PaymentEntity } from '../../payments/entities/payment.entity';
import { InvoicePaymentLinkEntity } from '../../payments/entities/invoice-payment-link.entity';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { InvoiceItemEntity } from './invoice-item.entity';

@Entity({ name: 'invoices' })
@Unique('uq_invoices_invoice_number', ['invoiceNumber'])
@Check(
  'chk_invoices_due_date_on_or_after_invoice_date',
  '"due_date" >= "invoice_date"',
)
@Check(
  'chk_invoices_invoice_sub_total_non_negative',
  '"invoice_sub_total" >= 0',
)
@Check('chk_invoices_tax_percentage_non_negative', '"tax_percentage" >= 0')
@Check('chk_invoices_total_tax_non_negative', '"total_tax" >= 0')
@Check('chk_invoices_total_discount_non_negative', '"total_discount" >= 0')
@Check('chk_invoices_total_amount_non_negative', '"total_amount" >= 0')
@Check('chk_invoices_total_paid_non_negative', '"total_paid" >= 0')
@Check('chk_invoices_balance_amount_non_negative', '"balance_amount" >= 0')
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_invoices',
  })
  id!: string;

  @Column({
    name: 'invoice_number',
    type: 'varchar',
    length: 100,
  })
  invoiceNumber!: string;

  @Column({
    name: 'invoice_reference',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  invoiceReference!: string | null;

  @Column({
    name: 'invoice_date',
    type: 'date',
  })
  invoiceDate!: string;

  @Column({
    name: 'due_date',
    type: 'date',
  })
  dueDate!: string;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 3,
  })
  currency!: string;

  @Column({
    name: 'currency_symbol',
    type: 'varchar',
    length: 8,
  })
  currencySymbol!: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description!: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: InvoiceStatus,
    enumName: 'invoice_status_enum',
    default: InvoiceStatus.DRAFT,
  })
  status!: InvoiceStatus;

  @Column({
    name: 'customer_fullname',
    type: 'varchar',
    length: 255,
  })
  customerFullname!: string;

  @Column({
    name: 'customer_email',
    type: 'varchar',
    length: 255,
  })
  customerEmail!: string;

  @Column({
    name: 'customer_mobile_number',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  customerMobileNumber!: string | null;

  @Column({
    name: 'customer_address',
    type: 'text',
    nullable: true,
  })
  customerAddress!: string | null;

  @Column({
    name: 'invoice_sub_total',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  invoiceSubTotal!: string;

  @Column({
    name: 'tax_percentage',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 10,
  })
  taxPercentage!: string;

  @Column({
    name: 'total_tax',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  totalTax!: string;

  @Column({
    name: 'total_discount',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  totalDiscount!: string;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  totalAmount!: string;

  @Column({
    name: 'total_paid',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  totalPaid!: string;

  @Column({
    name: 'balance_amount',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  balanceAmount!: string;

  @Column({
    name: 'issued_at',
    type: 'timestamptz',
    nullable: true,
  })
  issuedAt!: Date | null;

  @Column({
    name: 'sent_at',
    type: 'timestamptz',
    nullable: true,
  })
  sentAt!: Date | null;

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

  @Column({
    name: 'created_by_id',
    type: 'uuid',
  })
  createdById!: string;

  @ManyToOne(() => UserEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'created_by_id',
    foreignKeyConstraintName: 'fk_invoices_created_by_id_users_id',
  })
  createdBy!: UserEntity;

  @OneToMany(() => InvoiceItemEntity, (item) => item.invoice)
  items!: InvoiceItemEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.invoice)
  payments!: PaymentEntity[];

  @OneToMany(() => InvoicePaymentLinkEntity, (paymentLink) => paymentLink.invoice)
  paymentLinks!: InvoicePaymentLinkEntity[];
}
