import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Client } from 'pg';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.config';

export async function createTestApp(): Promise<{
  app: INestApplication;
  dataSource: DataSource;
}> {
  await ensureTestDatabase();

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();

  const dataSource = app.get(DataSource);
  await dataSource.runMigrations();

  return { app, dataSource };
}

export async function cleanDatabase(dataSource: DataSource): Promise<void> {
  await dataSource.query(
    'TRUNCATE TABLE invoice_items, invoices, users RESTART IDENTITY CASCADE',
  );
}

async function ensureTestDatabase(): Promise<void> {
  const dbName = process.env.POSTGRES_DB!;
  const client = new Client({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: 'postgres',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });

  await client.connect();
  const result = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName],
  );
  if (!result.rowCount) {
    await client.query(`CREATE DATABASE "${dbName}"`);
  }
  await client.end();
}
