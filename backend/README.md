# SimpleInvoice Backend

NestJS API for SimpleInvoice, backed by PostgreSQL, TypeORM migrations, JWT authentication, and Swagger documentation.

## Setup

```bash
npm install
cp .env.example .env
```

Update `.env` with your local PostgreSQL credentials. The application validates all required environment variables at startup.

## Database

Schema creation is intentionally migration-driven. `synchronize` and `migrationsRun` are disabled, so run migrations before seeding or starting against a fresh database:

```bash
npm run migration:run
npm run seed
```

Useful migration commands:

```bash
npm run migration:show
npm run migration:generate -- src/database/migrations/NameOfMigration
npm run migration:revert
```

## Run

```bash
npm run start:dev
```

Swagger is available at `http://localhost:4000/api/docs` by default.

## Test

```bash
npm run test
npm run test:e2e
npm run test:cov
```
