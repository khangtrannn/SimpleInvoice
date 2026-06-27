import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInvoiceQueryIndexes1782492000000 implements MigrationInterface {
  name = 'AddInvoiceQueryIndexes1782492000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "idx_invoices_invoice_date" ON "invoices" ("invoice_date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoices_due_date" ON "invoices" ("due_date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoices_status" ON "invoices" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoices_total_amount" ON "invoices" ("total_amount")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_invoices_total_amount"`);
    await queryRunner.query(`DROP INDEX "idx_invoices_status"`);
    await queryRunner.query(`DROP INDEX "idx_invoices_due_date"`);
    await queryRunner.query(`DROP INDEX "idx_invoices_invoice_date"`);
  }
}
