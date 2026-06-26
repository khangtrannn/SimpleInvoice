import Decimal from 'decimal.js';
import { faker } from '@faker-js/faker';

import {
  calculateInvoiceTotals,
  toMoney,
} from '../../invoices/domain/invoice-calculation';
import { InvoiceStatus } from '../../invoices/enums/invoice-status.enum';
import {
  FAKER_SEED,
  GENERATED_INVOICE_COUNT,
  SUPPORTED_CURRENCIES,
  TAX_PERCENTAGES,
} from './seed.constants';
import { daysFromToday } from './seed-date.util';
import { InvoiceSeedInput } from './invoice-seed.types';

export function createSeedInvoices(): InvoiceSeedInput[] {
  faker.seed(FAKER_SEED);

  return [
    createAppendixInvoice(),
    ...Array.from({ length: GENERATED_INVOICE_COUNT }, (_, index) =>
      createGeneratedInvoice(index),
    ),
  ];
}

function createAppendixInvoice(): InvoiceSeedInput {
  return {
    id: '099ca7da-a290-40fa-93b9-1c43ae7bb887',
    invoiceNumber: 'IV1780488206995',
    invoiceReference: '#5721662',
    invoiceDate: '2026-06-03',
    dueDate: '2026-07-03',
    currency: 'AUD',
    currencySymbol: 'AU$',
    description: 'Invoice is issued to Kanglee',
    status: InvoiceStatus.PENDING,

    customerFullname: 'Paul',
    customerEmail: 'paul@101digital.io',
    customerMobileNumber: '947717364111',
    customerAddress: 'Singapore',

    item: {
      id: 'b1c2d3e4-0000-0000-0000-000000000001',
      name: 'Honda RC150',
      quantity: 2,
      rate: '1000.00',
    },

    taxPercentage: '10.00',
    totalDiscount: '20.00',
    totalPaid: '1451.34',
  };
}

function createGeneratedInvoice(index: number): InvoiceSeedInput {
  const status = createPersistedStatus(index);
  const dueDateOffset = createDueDateOffset(index, status);
  const invoiceDateOffset = dueDateOffset - faker.number.int({ min: 7, max: 30 });

  const quantity = faker.number.int({ min: 1, max: 8 });
  const rate = toMoney(
    faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
  );
  const taxPercentage = faker.helpers.arrayElement(TAX_PERCENTAGES);
  const totalDiscount = toMoney(
    faker.number.float({ min: 0, max: 150, fractionDigits: 2 }),
  );

  const totalPaid = createTotalPaid({
    status,
    quantity,
    rate,
    taxPercentage,
    totalDiscount,
  });

  const customerFullname = faker.person.fullName();
  const currency = SUPPORTED_CURRENCIES[index % SUPPORTED_CURRENCIES.length];

  return {
    invoiceNumber: `SEED-${String(index + 1).padStart(4, '0')}`,
    invoiceReference: `#${faker.string.numeric(7)}`,
    invoiceDate: daysFromToday(invoiceDateOffset),
    dueDate: daysFromToday(dueDateOffset),
    currency: currency.currency,
    currencySymbol: currency.currencySymbol,
    description: faker.commerce.productDescription(),
    status,

    customerFullname,
    customerEmail: faker.internet.email({
      firstName: customerFullname.split(' ')[0],
      provider: 'example.com',
    }),
    customerMobileNumber: faker.phone.number(),
    customerAddress: faker.location.streetAddress({ useFullAddress: true }),

    item: {
      name: faker.commerce.productName(),
      quantity,
      rate,
    },

    taxPercentage,
    totalDiscount,
    totalPaid,
  };
}

function createPersistedStatus(index: number): InvoiceStatus {
  const statuses = [
    InvoiceStatus.DRAFT,
    InvoiceStatus.PENDING,
    InvoiceStatus.PAID,
  ];

  return statuses[index % statuses.length];
}

function createDueDateOffset(index: number, status: InvoiceStatus): number {
  const shouldBecomeOverdue = status !== InvoiceStatus.PAID && index % 5 === 0;

  if (shouldBecomeOverdue) {
    return -faker.number.int({ min: 1, max: 20 });
  }

  return faker.number.int({ min: 3, max: 45 });
}

function createTotalPaid(input: {
  status: InvoiceStatus;
  quantity: number;
  rate: string;
  taxPercentage: string;
  totalDiscount: string;
}): string {
  const totals = calculateInvoiceTotals({
    quantity: input.quantity,
    rate: input.rate,
    taxPercentage: input.taxPercentage,
    discount: input.totalDiscount,
    totalPaid: '0.00',
  });

  const totalAmount = new Decimal(totals.totalAmount);

  if (input.status === InvoiceStatus.PAID) {
    return toMoney(totalAmount);
  }

  if (input.status === InvoiceStatus.PENDING) {
    return toMoney(
      totalAmount.mul(
        faker.number.float({ min: 0.1, max: 0.7, fractionDigits: 2 }),
      ),
    );
  }

  return '0.00';
}