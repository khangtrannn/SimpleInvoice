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
npm run test          # unit tests
npm run test:e2e      # end-to-end tests (requires .env.test and a running PostgreSQL)
npm run test:cov      # unit tests with coverage report
```

### Testing approach

The test suite is split into two layers that complement each other: unit tests verify isolated logic quickly without I/O, and E2E tests verify the full HTTP stack against a real database.

#### Unit tests (`src/**/*.spec.ts`)

Unit tests use **Jest** and **`@nestjs/testing`**. Each spec creates a minimal `TestingModule` that wires only the class under test and replaces every dependency with a `jest.fn()` mock. This keeps tests fast and focused on a single unit's behaviour.

**What is covered:**

| Area | File | What it verifies |
|------|------|------------------|
| Auth service | `auth/auth.service.spec.ts` | Login flow, credential validation, token issuance |
| Auth controller | `auth/auth.controller.spec.ts` | Delegation to service; `getMe` endpoint with mocked guard |
| JWT guard | `auth/guards/jwt-auth.guard.spec.ts` | Valid token, missing/malformed/expired token, revoked user |
| Access token service | `auth/services/access-token.service.spec.ts` | JWT signing and expiry config |
| Password utility | `auth/utils/password.util.spec.ts` | `bcrypt.compare` delegation |
| Auth response mapper | `auth/mappers/auth-user-response.mapper.spec.ts` | `passwordHash` is never exposed |
| Invoices service | `invoices/invoices.serivce.spec.ts` | `findAll`, `findOne`, `create`; conflict on duplicate number; domain validation failure; unexpected repository errors |
| Invoices controller | `invoices/invoices.controller.spec.ts` | Delegation to service with mocked guard |
| Invoice calculation | `invoices/domain/invoice-calculation.spec.ts` | Subtotal, tax, discount, paid, and balance rounding (Decimal.js); over-discount and over-paid validation |
| Users service | `users/user.service.spec.ts` | Email normalisation, lookup by ID, null handling |
| Date validators | `common/validators/date-only.validator.spec.ts` | `IsDateOnly`, `IsDateOnOrAfter`, `IsDateRange` — format and ordering rules |
| Postgres error util | `database/postgres-errors.util.spec.ts` | `isUniqueViolation` identifies unique constraint errors by constraint name |

**Mocking strategy:** repositories, external services (`JwtService`, `ConfigService`), and third-party libraries (`bcrypt`) are replaced with typed `jest.Mocked` partial objects. Guards are swapped out via `overrideGuard` so controller tests do not depend on token verification.

#### E2E tests (`test/*.e2e-spec.ts`)

E2E tests use **Jest** + **supertest** and boot a real NestJS application backed by a dedicated PostgreSQL database configured in `.env.test`. TypeORM migrations run during setup so the schema is always fresh. Each suite cleans the database in `beforeAll` to guarantee isolation between test files.

**Setup helpers (`test/helpers/`):**
- `app.helper.ts` — creates the `INestApplication`, runs migrations, and provides `cleanDatabase` (truncates all tables).
- `auth.helper.ts` — `getAuthToken` logs in and returns a JWT; `authedRequest` wraps supertest with the `Authorization` header attached.
- `user.helper.ts` — seeds a test user with a bcrypt-hashed password directly into the database.

**What is covered:**

| Suite | File | Scenarios |
|-------|------|-----------|
| Health | `app.e2e-spec.ts` | `GET /health` returns 200 |
| Auth | `auth.e2e-spec.ts` | Login with valid credentials → 200 + JWT; invalid password → 401; email validation → 400; `GET /auth/me` with valid/missing/malformed token |
| Invoices — create | `invoices.e2e-spec.ts` | `POST /invoices` with full payload → 201 + computed totals; minimal required fields → 201 with nullable optionals as `null`; duplicate invoice number → 409; missing required field → 400; no token → 401 |
| Invoices — list | `invoices.e2e-spec.ts` | `GET /invoices` default pagination; keyword filter (invoice number, customer name); date range filter; invalid date range → 400; page 2 offset; no token → 401 |
| Invoices — detail | `invoices.e2e-spec.ts` | `GET /invoices/:id` known ID → 200 with full detail; non-existent UUID → 404; invalid UUID → 400; no token → 401 |

**E2E configuration:** `test/jest-e2e.json` sets `testTimeout: 30000` (network + migration overhead) and loads `.env.test` via `setupFiles` before any test runs.

## Validation Design

Validation is split by boundary so each rule lives where it is most reliable and easiest to review.

### HTTP DTO validation

Request DTOs use `class-validator` and `class-transformer` for input shape, type coercion, and request-level constraints. The global `ValidationPipe` is configured with `whitelist`, `forbidNonWhitelisted`, and `transform`, so controllers receive stripped, typed DTO instances instead of raw request bodies.

Examples:

- `CreateInvoiceDto` validates customer fields, invoice dates, currency, tax percentage, discount, and nested invoice item input.
- `CreateInvoiceItemDto` validates item name, quantity, and rate.
- `GetInvoicesQueryDto` validates pagination, sorting, status, keyword, and date filters.
- Cross-field request checks such as `dueDate >= invoiceDate` and `fromDate <= toDate` are implemented as custom `class-validator` decorators because they describe whether the HTTP request is well formed.

Cross-field date validators intentionally skip comparison when either date is missing or malformed. Field-level validators report missing or invalid dates; the cross-field validator only reports ordering errors once both values are valid. This keeps API errors focused and avoids duplicate messages for the same bad input.

### Domain validation

Computed invoice money rules live in `calculateInvoiceTotals`. These rules are not DTO-only checks because they depend on business calculations and must hold for every caller, including seed scripts and future non-HTTP workflows.

Examples:

- Discount must not exceed subtotal plus tax.
- Total paid must not exceed total amount.

Services call the domain function and map `InvoiceCalculationError` to an HTTP `400 Bad Request`. The calculation function remains the source of truth for monetary invariants.

### Persistence constraints

Database constraints are the final safety net for persisted invariants such as unique invoice numbers, non-negative money columns, positive item quantity/rate, and `due_date >= invoice_date`. These constraints are intentionally duplicated with higher-level validation where useful: DTO/domain validation gives clean API errors, while database constraints protect the data if another code path or future migration bypasses the API layer.

### Service responsibilities

Services should orchestrate use cases, transactions, and error mapping. They should avoid repeating DTO validation or duplicating domain formulas. If a new rule only describes request shape, add it to the DTO. If a rule must hold regardless of caller, put it in the domain layer and have the service translate the resulting error for HTTP clients.

## Service and Repository Design

Feature modules use an injectable repository wrapper when they own database access. This keeps services focused on application behavior while repositories own TypeORM details.

### Services

Services coordinate use cases and API-facing behavior:

- Call domain functions such as `calculateInvoiceTotals`.
- Decide which repository operation to run.
- Translate domain or persistence failures into HTTP exceptions.
- Map entities into response DTOs.

Services should not build SQL queries, manage TypeORM transactions, or know which relations must be loaded for persistence.

### Repositories

Repository wrappers coordinate persistence details:

- Inject TypeORM repositories with `@InjectRepository`.
- Build query builders, filters, sorting, and pagination.
- Load entities with the relations required by a use case.
- Save related entities inside TypeORM transactions.
- Expose small persistence helpers such as unique-constraint detection.

The project intentionally uses injectable wrapper classes, such as `InvoicesRepository` and `UsersRepository`, instead of extending TypeORM `Repository`. Wrapper classes are easier to register with Nest dependency injection and make transaction boundaries explicit through `DataSource.transaction`.

### Current Module Pattern

Modules that own persistence register both the TypeORM entities and the repository wrapper:

```ts
@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity, InvoiceItemEntity])],
  providers: [InvoicesRepository, InvoicesService],
})
export class InvoicesModule {}
```

This split is most valuable for modules with query builders, transactions, or repeated lookup methods. Modules without persistence, such as health checks, do not need a repository layer.
