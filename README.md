# SimpleInvoice

A full-stack invoice management application built with NestJS (backend) and ReactJS (frontend), backed by PostgreSQL.

## Project Structure

```
SimpleInvoice/
├── backend/          # NestJS REST API
├── docker-compose.yml
└── start.sh          # One-command setup script
```

This is a monorepo. Detailed documentation for each layer lives alongside the code:

- [Backend README](./backend/README.md) — API setup, migrations, testing, validation design

> Frontend is in progress. Its README will be added under `frontend/`.

---

## Quick Start (Docker)

> **Requires:** Docker Desktop running

```bash
./start.sh
```

This single command:
1. Copies `backend/.env.example` → `backend/.env` if it does not exist (then exits so you can review it)
2. Builds and starts all Docker services
3. Waits for the backend to be healthy
4. Runs database migrations
5. Seeds the database with sample data

Once complete, the app is available at:

| Service     | URL                              |
|-------------|----------------------------------|
| Backend API | http://localhost:4000            |
| Swagger UI  | http://localhost:4000/api/docs   |
| PostgreSQL  | localhost:5432                   |

---

## Default Login Credentials

Seeded by `npm run seed` / `start.sh`:

| Field    | Value                          |
|----------|--------------------------------|
| Email    | `reviewer@simpleinvoice.local` |
| Password | `Password123!`                 |

---

## Manual Setup (Without Docker)

**Requirements:** Node.js 20+, PostgreSQL 14+

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

# 3. Run migrations
npm run migration:run

# 4. Seed the database
npm run seed

# 5. Start the server
npm run start:dev
```

---

## Environment Variables

All configuration is driven by `backend/.env`. Copy `backend/.env.example` as a starting point.

| Variable            | Description                              | Default  |
|---------------------|------------------------------------------|----------|
| `NODE_ENV`          | Runtime environment                      | `development` |
| `PORT`              | HTTP port the backend listens on         | `4000`   |
| `POSTGRES_HOST`     | PostgreSQL host                          | —        |
| `POSTGRES_PORT`     | PostgreSQL port                          | `5432`   |
| `POSTGRES_USER`     | PostgreSQL user                          | —        |
| `POSTGRES_PASSWORD` | PostgreSQL password                      | —        |
| `POSTGRES_DB`       | PostgreSQL database name                 | —        |
| `JWT_SECRET`        | Secret for signing JWT tokens (min 32 chars) | —    |
| `JWT_EXPIRES_IN`    | Token expiry in seconds                  | `3600`   |

---

## Architecture Decisions

- **Monorepo** — backend and frontend share one repository for simpler reviewer setup and a single `docker-compose.yml`.
- **Migration-driven schema** — `synchronize` and `migrationsRun` are disabled in TypeORM. Schema changes are always explicit migrations, never auto-applied.
- **Customer as embedded fields** — customer data (name, email, mobile, address) is stored as columns on the `invoices` table rather than a separate `customers` table. Invoices are self-contained records; no customer identity is shared across invoices.
- **Overdue is derived, never stored** — the database only persists `Draft`, `Pending`, and `Paid`. The `Overdue` status is computed at read time when `status != Paid AND dueDate < today`.
- **Server-side totals** — `subTotal`, `taxAmount`, `totalAmount`, and `balanceAmount` are calculated in a pure domain function on the backend and never trusted from the client.

## Known Limitations

- Frontend is not yet implemented.
- Only one invoice line item is supported per invoice (the data model is designed to support multiple items in the future).
