import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { WebhookEventStatus } from '../enums/webhook-event-status.enum';

@Entity('webhook_events')
export class WebhookEventEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'pk_webhook_events',
  })
  id!: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  provider!: string;

  @Column({
    name: 'provider_event_id',
    type: 'varchar',
    length: 255,
  })
  providerEventId!: string;

  @Column({
    name: 'event_type',
    type: 'varchar',
    length: 255,
  })
  eventType!: string;

  @Column({
    type: 'enum',
    enum: WebhookEventStatus,
    enumName: 'webhook_event_status_enum',
    default: WebhookEventStatus.Received,
  })
  status!: WebhookEventStatus;

  @Column({
    type: 'jsonb',
  })
  payload!: Record<string, unknown>;

  @Column({
    name: 'processed_at',
    type: 'timestamptz',
    nullable: true,
  })
  processedAt!: Date | null;

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
