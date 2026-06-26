import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvoicesTable1782491427934 implements MigrationInterface {
    name = 'CreateInvoicesTable1782491427934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invoice_status_enum" AS ENUM('Draft', 'Pending', 'Paid')`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoice_number" character varying(100) NOT NULL, "invoice_reference" character varying(100), "invoice_date" date NOT NULL, "due_date" date NOT NULL, "currency" character varying(3) NOT NULL, "currency_symbol" character varying(8) NOT NULL, "description" text, "status" "public"."invoice_status_enum" NOT NULL DEFAULT 'Draft', "customer_fullname" character varying(255) NOT NULL, "customer_email" character varying(255) NOT NULL, "customer_mobile_number" character varying(50), "customer_address" text, "invoice_sub_total" numeric(14,2) NOT NULL DEFAULT '0', "tax_percentage" numeric(5,2) NOT NULL DEFAULT '10', "total_tax" numeric(14,2) NOT NULL DEFAULT '0', "total_discount" numeric(14,2) NOT NULL DEFAULT '0', "total_amount" numeric(14,2) NOT NULL DEFAULT '0', "total_paid" numeric(14,2) NOT NULL DEFAULT '0', "balance_amount" numeric(14,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_id" uuid NOT NULL, CONSTRAINT "uq_invoices_invoice_number" UNIQUE ("invoice_number"), CONSTRAINT "chk_invoices_balance_amount_non_negative" CHECK ("balance_amount" >= 0), CONSTRAINT "chk_invoices_total_paid_non_negative" CHECK ("total_paid" >= 0), CONSTRAINT "chk_invoices_total_amount_non_negative" CHECK ("total_amount" >= 0), CONSTRAINT "chk_invoices_total_discount_non_negative" CHECK ("total_discount" >= 0), CONSTRAINT "chk_invoices_total_tax_non_negative" CHECK ("total_tax" >= 0), CONSTRAINT "chk_invoices_tax_percentage_non_negative" CHECK ("tax_percentage" >= 0), CONSTRAINT "chk_invoices_invoice_sub_total_non_negative" CHECK ("invoice_sub_total" >= 0), CONSTRAINT "chk_invoices_due_date_on_or_after_invoice_date" CHECK ("due_date" >= "invoice_date"), CONSTRAINT "pk_invoices" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "fk_invoices_created_by_id_users_id" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "fk_invoices_created_by_id_users_id"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TYPE "public"."invoice_status_enum"`);
    }

}
