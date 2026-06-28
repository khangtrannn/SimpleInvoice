import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';

import { REVIEWER_USER } from '../src/database/seed/seed.constants';
import { cleanDatabase, createTestApp } from './helpers/app.helper';
import { authedRequest, getAuthToken } from './helpers/auth.helper';
import { seedTestUser } from './helpers/user.helper';

const BASE_INVOICE_PAYLOAD = {
  customerName: 'Paul',
  customerEmail: 'paul@example.com',
  invoiceNumber: 'IV-E2E-001',
  invoiceDate: '2026-06-01',
  dueDate: '2026-07-01',
  currency: 'AUD',
  item: { name: 'Honda RC150', quantity: 2, rate: 1000 },
  taxPercentage: 10,
  discount: 0,
};

describe('Invoices (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let api: ReturnType<typeof authedRequest>;

  beforeAll(async () => {
    ({ app, dataSource } = await createTestApp());
    await cleanDatabase(dataSource);
    await seedTestUser(
      dataSource,
      REVIEWER_USER.email,
      REVIEWER_USER.password,
      REVIEWER_USER.fullname,
    );
    const authToken = await getAuthToken(
      app,
      REVIEWER_USER.email,
      REVIEWER_USER.password,
    );
    api = authedRequest(app, authToken);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /invoices', () => {
    it('should return 201 with computed totals when the payload is valid and complete', async () => {
      // Arrange
      const payload = {
        ...BASE_INVOICE_PAYLOAD,
        invoiceNumber: 'IV-E2E-POST-FULL',
        customerMobile: '0412345678',
        customerAddress: 'Sydney, AU',
        invoiceReference: '#REF-001',
        description: 'Test invoice',
      };

      // Act
      const res = await api.post('/invoices').send(payload);

      // Assert
      expect(res.status).toBe(201);
      expect(res.body.invoiceNumber).toBe(payload.invoiceNumber);
      expect(res.body.invoiceReference).toBe('#REF-001');
      expect(res.body.status).toBe('Draft');
      expect(res.body.customer).toMatchObject({
        fullname: 'Paul',
        email: 'paul@example.com',
        mobileNumber: '0412345678',
        address: 'Sydney, AU',
      });
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0]).toMatchObject({
        name: 'Honda RC150',
        quantity: 2,
        rate: '1000.00',
      });
      expect(res.body.invoiceSubTotal).toBe('2000.00');
      expect(res.body.taxPercentage).toBe('10.00');
      expect(res.body.totalTax).toBe('200.00');
      expect(res.body.totalDiscount).toBe('0.00');
      expect(res.body.totalAmount).toBe('2200.00');
      expect(res.body.totalPaid).toBe('0.00');
      expect(res.body.balanceAmount).toBe('2200.00');
    });

    it('should return 201 with nullable optional fields as null when only required fields are provided', async () => {
      // Arrange
      const payload = {
        customerName: 'Jane',
        customerEmail: 'jane@example.com',
        invoiceNumber: 'IV-E2E-POST-MIN',
        invoiceDate: '2026-06-01',
        dueDate: '2026-07-01',
        currency: 'USD',
        item: { name: 'Consulting', quantity: 1, rate: 500 },
      };

      // Act
      const res = await api.post('/invoices').send(payload);

      // Assert
      expect(res.status).toBe(201);
      expect(res.body.customer.mobileNumber).toBeNull();
      expect(res.body.customer.address).toBeNull();
      expect(res.body.invoiceReference).toBeNull();
      expect(res.body.description).toBeNull();
    });

    it('should return 409 when the invoice number already exists', async () => {
      // Arrange
      const payload = { ...BASE_INVOICE_PAYLOAD, invoiceNumber: 'IV-E2E-DUP' };
      await api.post('/invoices').send(payload).expect(201);

      // Act — send the same invoice number again
      const res = await api.post('/invoices').send(payload);

      // Assert
      expect(res.status).toBe(409);
    });

    it('should return 400 when a required field is missing', async () => {
      // Arrange
      const payloadWithoutInvoiceNumber: Partial<typeof BASE_INVOICE_PAYLOAD> =
        {
          ...BASE_INVOICE_PAYLOAD,
        };
      delete payloadWithoutInvoiceNumber.invoiceNumber;

      // Act
      const res = await api.post('/invoices').send(payloadWithoutInvoiceNumber);

      // Assert
      expect(res.status).toBe(400);
    });

    it('should return 401 when no token is provided', async () => {
      // Act
      const res = await request(app.getHttpServer())
        .post('/invoices')
        .send(BASE_INVOICE_PAYLOAD);

      // Assert
      expect(res.status).toBe(401);
    });
  });

  describe('GET /invoices', () => {
    beforeAll(async () => {
      const invoices = [
        {
          ...BASE_INVOICE_PAYLOAD,
          invoiceNumber: 'IV-E2E-LIST-001',
          customerName: 'Alice',
          customerEmail: 'alice@example.com',
          invoiceDate: '2026-05-01',
          dueDate: '2026-06-01',
        },
        {
          ...BASE_INVOICE_PAYLOAD,
          invoiceNumber: 'IV-E2E-LIST-002',
          customerName: 'Bob',
          customerEmail: 'bob@example.com',
          invoiceDate: '2026-06-15',
          dueDate: '2026-07-15',
        },
        {
          ...BASE_INVOICE_PAYLOAD,
          invoiceNumber: 'IV-E2E-LIST-003',
          customerName: 'Carol',
          customerEmail: 'carol@example.com',
          invoiceDate: '2026-07-01',
          dueDate: '2026-07-31',
        },
      ];

      for (const payload of invoices) {
        await api.post('/invoices').send(payload).expect(201);
      }
    });

    it('should return 200 with a paginated list and correct paging metadata when no filters are applied', async () => {
      // Act
      const res = await api.get('/invoices');

      // Assert
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.paging).toMatchObject({
        page: 1,
        pageSize: 10,
        total: expect.any(Number),
      });
      expect(res.body.paging.total).toBeGreaterThanOrEqual(3);
    });

    it('should return 200 with only matching results when a keyword matches invoice number', async () => {
      // Act
      const res = await api
        .get('/invoices')
        .query({ keyword: 'IV-E2E-LIST-002' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].invoiceNumber).toBe('IV-E2E-LIST-002');
    });

    it('should return 200 with only matching results when a keyword matches customer name', async () => {
      // Act
      const res = await api.get('/invoices').query({ keyword: 'Carol' });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(
        res.body.data.every((inv: { customerName: string }) =>
          inv.customerName.toLowerCase().includes('carol'),
        ),
      ).toBe(true);
    });

    it('should return 200 with only invoices within the date range when fromDate and toDate are set', async () => {
      // Arrange
      const fromDate = '2026-06-01';
      const toDate = '2026-06-30';

      // Act
      const res = await api.get('/invoices').query({ fromDate, toDate });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(
        res.body.data.every(
          (inv: { invoiceDate: string }) =>
            inv.invoiceDate >= fromDate && inv.invoiceDate <= toDate,
        ),
      ).toBe(true);
    });

    it('should return 400 when fromDate is after toDate', async () => {
      // Act
      const res = await api
        .get('/invoices')
        .query({ fromDate: '2026-07-01', toDate: '2026-06-01' });

      // Assert
      expect(res.status).toBe(400);
    });

    it('should return 200 with correct offset results when requesting the second page', async () => {
      // Arrange
      const pageSize = 2;

      // Act
      const firstPage = await api
        .get('/invoices')
        .query({ page: 1, pageSize })
        .expect(200);

      const secondPage = await api
        .get('/invoices')
        .query({ page: 2, pageSize })
        .expect(200);

      // Assert
      const firstIds = firstPage.body.data.map((i: { id: string }) => i.id);
      const secondIds = secondPage.body.data.map((i: { id: string }) => i.id);
      expect(firstIds).not.toEqual(secondIds);
      expect(secondPage.body.paging.page).toBe(2);
    });

    it('should return 401 when no token is provided', async () => {
      // Act
      const res = await request(app.getHttpServer()).get('/invoices');

      // Assert
      expect(res.status).toBe(401);
    });
  });

  describe('GET /invoices/summary', () => {
    it('should return 200 with aggregated totals and counts', async () => {
      // Act
      const res = await api.get('/invoices/summary');

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        totalRevenue: expect.any(String),
        totalPaid: expect.any(String),
        totalPending: expect.any(String),
        totalOverdue: expect.any(String),
        totalDraft: expect.any(String),
        paidCount: expect.any(Number),
        pendingCount: expect.any(Number),
        overdueCount: expect.any(Number),
        draftCount: expect.any(Number),
        currencyCount: expect.any(Number),
      });
      // Drafts exist from the list tests, so the draft count is at least 1
      expect(res.body.draftCount).toBeGreaterThanOrEqual(1);
    });

    it('should respect the same filters as GET /invoices', async () => {
      // Act
      const filtered = await api
        .get('/invoices/summary')
        .query({ keyword: 'IV-E2E-LIST-002' });
      const unfiltered = await api.get('/invoices/summary');

      // Assert
      expect(filtered.status).toBe(200);
      expect(unfiltered.status).toBe(200);
      const filteredDraftCount = Number(filtered.body.draftCount);
      const unfilteredDraftCount = Number(unfiltered.body.draftCount);
      expect(filteredDraftCount).toBeLessThanOrEqual(unfilteredDraftCount);
      expect(filteredDraftCount).toBeGreaterThanOrEqual(1);
    });

    it('should return 401 when no token is provided', async () => {
      // Act
      const res = await request(app.getHttpServer()).get('/invoices/summary');

      // Assert
      expect(res.status).toBe(401);
    });
  });

  describe('GET /invoices/:id', () => {
    let createdInvoiceId: string;

    beforeAll(async () => {
      const res = await api
        .post('/invoices')
        .send({ ...BASE_INVOICE_PAYLOAD, invoiceNumber: 'IV-E2E-DETAIL' })
        .expect(201);

      createdInvoiceId = res.body.id;
    });

    it('should return 200 with the full invoice detail when the ID exists', async () => {
      // Act
      const res = await api.get(`/invoices/${createdInvoiceId}`);

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdInvoiceId);
      expect(res.body.invoiceNumber).toBe('IV-E2E-DETAIL');
      expect(res.body.customer).toBeDefined();
      expect(res.body.items).toBeDefined();
      expect(res.body.invoiceSubTotal).toBeDefined();
    });

    it('should return 404 when the invoice ID does not exist', async () => {
      // Arrange
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      // Act
      const res = await api.get(`/invoices/${nonExistentId}`);

      // Assert
      expect(res.status).toBe(404);
    });

    it('should return 400 when the ID is not a valid UUID', async () => {
      // Act
      const res = await api.get('/invoices/not-a-uuid');

      // Assert
      expect(res.status).toBe(400);
    });

    it('should return 401 when no token is provided', async () => {
      // Act
      const res = await request(app.getHttpServer()).get(
        `/invoices/${createdInvoiceId}`,
      );

      // Assert
      expect(res.status).toBe(401);
    });
  });
});
