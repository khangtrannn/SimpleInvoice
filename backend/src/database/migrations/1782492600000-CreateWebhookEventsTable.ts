import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWebhookEventsTable1782492600000
  implements MigrationInterface
{
  name = 'CreateWebhookEventsTable1782492600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "webhook_event_status_enum" AS ENUM (
        'Received',
        'Processed',
        'Failed',
        'Ignored'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "webhook_events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "provider" varchar(50) NOT NULL,
        "provider_event_id" varchar(255) NOT NULL,
        "event_type" varchar(255) NOT NULL,
        "status" "webhook_event_status_enum" NOT NULL DEFAULT 'Received',
        "payload" jsonb NOT NULL,
        "processed_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "pk_webhook_events" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "webhook_events"
    `);

    await queryRunner.query(`
      DROP TYPE "webhook_event_status_enum"
    `);
  }
}
