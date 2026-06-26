import bcrypt from 'bcrypt';
import { DataSource, EntityManager, In } from 'typeorm';

import { InvoiceItemEntity } from '../../invoices/entities/invoice-item.entity';
import { InvoiceEntity } from '../../invoices/entities/invoice.entity';
import {
  calculateInvoiceTotals,
  toMoney,
} from '../../invoices/domain/invoice-calculation';
import { UserEntity } from '../../users/entities/user.entity';
import { createSeedInvoices } from './invoice-seed.factory';
import { BCRYPT_SALT_ROUNDS, REVIEWER_USER } from './seed.constants';
import { InvoiceSeedInput } from './invoice-seed.types';

export async function runDatabaseSeed(dataSource: DataSource): Promise<void> {
  await dataSource.transaction(async (manager) => {
    const reviewer = await upsertReviewerUser(manager);
    const seedInvoices = createSeedInvoices();

    await deleteExistingSeedInvoices(manager, seedInvoices);
    await createInvoices(manager, seedInvoices, reviewer.id);

    console.log(`Seeded reviewer user: ${REVIEWER_USER.email}`);
    console.log(`Seeded invoices: ${seedInvoices.length}`);
    console.log(`Default password: ${REVIEWER_USER.password}`);
  });
}

async function upsertReviewerUser(manager: EntityManager): Promise<UserEntity> {
  const userRepository = manager.getRepository(UserEntity);

  const passwordHash = await bcrypt.hash(
    REVIEWER_USER.password,
    BCRYPT_SALT_ROUNDS,
  );

  await userRepository.upsert(
    {
      email: REVIEWER_USER.email,
      passwordHash,
      fullname: REVIEWER_USER.fullname,
    },
    ['email'],
  );

  return userRepository.findOneByOrFail({
    email: REVIEWER_USER.email,
  });
}

async function deleteExistingSeedInvoices(
  manager: EntityManager,
  seedInvoices: InvoiceSeedInput[],
): Promise<void> {
  const invoiceRepository = manager.getRepository(InvoiceEntity);
  const invoiceNumbers = seedInvoices.map((invoice) => invoice.invoiceNumber);

  await invoiceRepository.delete({
    invoiceNumber: In(invoiceNumbers),
  });
}

async function createInvoices(
  manager: EntityManager,
  seedInvoices: InvoiceSeedInput[],
  reviewerUserId: string,
): Promise<void> {
  for (const seedInvoice of seedInvoices) {
    await createInvoice(manager, seedInvoice, reviewerUserId);
  }
}

async function createInvoice(
  manager: EntityManager,
  seedInvoice: InvoiceSeedInput,
  reviewerUserId: string,
): Promise<void> {
  const invoiceRepository = manager.getRepository(InvoiceEntity);
  const invoiceItemRepository = manager.getRepository(InvoiceItemEntity);

  const totals = calculateInvoiceTotals({
    quantity: seedInvoice.item.quantity,
    rate: seedInvoice.item.rate,
    taxPercentage: seedInvoice.taxPercentage,
    discount: seedInvoice.totalDiscount,
    totalPaid: seedInvoice.totalPaid,
  });

  const invoice = invoiceRepository.create({
    id: seedInvoice.id,
    invoiceNumber: seedInvoice.invoiceNumber,
    invoiceReference: seedInvoice.invoiceReference ?? null,
    invoiceDate: seedInvoice.invoiceDate,
    dueDate: seedInvoice.dueDate,
    currency: seedInvoice.currency,
    currencySymbol: seedInvoice.currencySymbol,
    description: seedInvoice.description ?? null,
    status: seedInvoice.status,

    customerFullname: seedInvoice.customerFullname,
    customerEmail: seedInvoice.customerEmail,
    customerMobileNumber: seedInvoice.customerMobileNumber ?? null,
    customerAddress: seedInvoice.customerAddress ?? null,

    invoiceSubTotal: totals.invoiceSubTotal,
    taxPercentage: seedInvoice.taxPercentage,
    totalTax: totals.totalTax,
    totalDiscount: toMoney(seedInvoice.totalDiscount),
    totalAmount: totals.totalAmount,
    totalPaid: toMoney(seedInvoice.totalPaid),
    balanceAmount: totals.balanceAmount,

    createdById: reviewerUserId,
  });

  const savedInvoice = await invoiceRepository.save(invoice);

  await invoiceItemRepository.save(
    invoiceItemRepository.create({
      id: seedInvoice.item.id,
      invoiceId: savedInvoice.id,
      name: seedInvoice.item.name,
      quantity: seedInvoice.item.quantity,
      rate: seedInvoice.item.rate,
    }),
  );
}