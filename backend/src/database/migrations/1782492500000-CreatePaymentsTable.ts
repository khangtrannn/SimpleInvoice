import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1782492500000 implements MigrationInterface {
  name = 'CreatePaymentsTable1782492500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "payment_status_enum" AS ENUM (
        'Pending',
        'Succeeded',
        'Failed',
        'Cancelled'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "payment_provider_enum" AS ENUM (
        'Stripe'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "invoice_id" uuid NOT NULL,
        "amount" numeric(14, 2) NOT NULL,
        "currency" varchar(3) NOT NULL,
        "status" "payment_status_enum" NOT NULL DEFAULT 'Pending',
        "provider" "payment_provider_enum" NOT NULL,
        "stripe_checkout_session_id" varchar(255),
        "stripe_payment_intent_id" varchar(255),
        "failure_reason" text,
        "paid_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "pk_payments" PRIMARY KEY ("id"),
        CONSTRAINT "fk_payments_invoice_id"
          FOREIGN KEY ("invoice_id")
          REFERENCES "invoices"("id")
          ON DELETE RESTRICT,
        CONSTRAINT "chk_payments_amount_positive"
          CHECK ("amount" > 0),
        CONSTRAINT "chk_payments_currency_length"
          CHECK (char_length("currency") = 3)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "payments"
    `);

    await queryRunner.query(`
      DROP TYPE "payment_provider_enum"
    `);

    await queryRunner.query(`
      DROP TYPE "payment_status_enum"
    `);
  }
}
