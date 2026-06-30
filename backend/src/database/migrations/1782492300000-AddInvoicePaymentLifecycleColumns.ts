import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInvoicePaymentLifecycleColumns1782492300000
  implements MigrationInterface
{
  name = 'AddInvoicePaymentLifecycleColumns1782492300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "invoices"
      ADD COLUMN "issued_at" TIMESTAMPTZ
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      ADD COLUMN "sent_at" TIMESTAMPTZ
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      ADD COLUMN "paid_at" TIMESTAMPTZ
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP COLUMN "paid_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP COLUMN "sent_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP COLUMN "issued_at"
    `);
  }
}
