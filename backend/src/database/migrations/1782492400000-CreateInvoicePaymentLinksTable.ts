import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoicePaymentLinksTable1782492400000
  implements MigrationInterface
{
  name = 'CreateInvoicePaymentLinksTable1782492400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "invoice_payment_links" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "invoice_id" uuid NOT NULL,
        "token_hash" varchar(64) NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "revoked_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "pk_invoice_payment_links" PRIMARY KEY ("id"),
        CONSTRAINT "fk_invoice_payment_links_invoice_id"
          FOREIGN KEY ("invoice_id")
          REFERENCES "invoices"("id")
          ON DELETE RESTRICT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "invoice_payment_links"
    `);
  }
}
