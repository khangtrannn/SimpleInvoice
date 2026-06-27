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
