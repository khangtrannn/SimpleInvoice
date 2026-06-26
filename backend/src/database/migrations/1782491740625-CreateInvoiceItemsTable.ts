import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvoiceItemsTable1782491740625 implements MigrationInterface {
    name = 'CreateInvoiceItemsTable1782491740625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoice_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "quantity" integer NOT NULL, "rate" numeric(14,2) NOT NULL, CONSTRAINT "chk_invoice_items_rate_positive" CHECK ("rate" > 0), CONSTRAINT "chk_invoice_items_quantity_positive" CHECK ("quantity" > 0), CONSTRAINT "pk_invoice_items" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD CONSTRAINT "fk_invoice_items_invoice_id_invoices_id" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "fk_invoice_items_invoice_id_invoices_id"`);
        await queryRunner.query(`DROP TABLE "invoice_items"`);
    }

}
