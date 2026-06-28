# SimpleInvoice

A full-stack invoice management application built with NestJS (backend) and React + TypeScript (frontend), backed by PostgreSQL.

## Project Structure

```
SimpleInvoice/
├── backend/           # NestJS REST API
├── frontend/          # React + TypeScript + Vite SPA
├── docker-compose.yml
├── start.sh           # One-command startup script
└── stop.sh            # One-command teardown script
```

This is a monorepo. Detailed documentation for each layer lives alongside the code:

- [Backend README](./backend/README.md) — API setup, migrations, testing, validation design
- [Frontend README](./frontend/README.md) — UI design decisions

---

## Quick Start (Docker)

> **Requires:** Docker Desktop running

```bash
./start.sh
```

This single command:
1. Copies `.env.example` → `.env` and `backend/.env.example` → `backend/.env` if either file does not exist
2. Builds and starts all Docker services (PostgreSQL, backend, frontend)
3. Waits for the backend to be healthy
4. Runs compiled production database migrations
5. Seeds the database with sample data
6. Waits for the frontend to be ready

Once complete, the app is available at:

| Service     | URL                              |
|-------------|----------------------------------|
| Frontend    | http://localhost:3000            |
| Backend API | http://localhost:4000            |
| Swagger UI  | http://localhost:4000/api/docs   |
| PostgreSQL  | localhost:5432                   |

To stop all services:

```bash
./stop.sh
```

Pass `--volumes` (or `-v`) to also remove the PostgreSQL data volume:

```bash
./stop.sh --volumes
```

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
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env — set POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
npm run migration:run
npm run seed
npm run start:dev

# Frontend (in a separate terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Environment Variables

Docker Compose reads the root `.env` for container wiring and `backend/.env` for backend runtime secrets. Inside Docker, the backend overrides `POSTGRES_HOST` to `postgres`; for local Node.js development, use `localhost`.

| Variable            | Description                                  | Default       |
|---------------------|----------------------------------------------|---------------|
| `NODE_ENV`          | Runtime environment                          | `development` |
| `PORT`              | HTTP port the backend listens on             | `4000`        |
| `APP_PORT`          | Host port mapped to the backend container    | `4000`        |
| `FRONTEND_PORT`     | Host port mapped to the frontend container   | `3000`        |
| `POSTGRES_HOST`     | PostgreSQL host                              | —             |
| `POSTGRES_PORT`     | PostgreSQL port                              | `5432`        |
| `POSTGRES_USER`     | PostgreSQL user                              | —             |
| `POSTGRES_PASSWORD` | PostgreSQL password                          | —             |
| `POSTGRES_DB`       | PostgreSQL database name                     | —             |
| `JWT_SECRET`        | Secret for signing JWT tokens (min 32 chars) | —             |
| `JWT_EXPIRES_IN`    | Token expiry in seconds                      | `3600`        |

---

## Architecture Decisions

- **Monorepo** — backend and frontend share one repository for simpler reviewer setup and a single `docker-compose.yml`.
- **Migration-driven schema** — `synchronize` and `migrationsRun` are disabled in TypeORM. Schema changes are always explicit migrations, never auto-applied.
- **Customer as embedded fields** — customer data (name, email, mobile, address) is stored as columns on the `invoices` table rather than a separate `customers` table. Invoices are self-contained records; no customer identity is shared across invoices.
- **Overdue is derived, never stored** — the database only persists `Draft`, `Pending`, and `Paid`. The `Overdue` status is computed at read time when `status != Paid AND dueDate < today`.
- **UTC business date** — `today` for derived `Overdue` status is based on the UTC date to keep Docker, CI, and local runs deterministic.
- **Server-side totals** — `subTotal`, `taxAmount`, `totalAmount`, and `balanceAmount` are calculated in a pure domain function on the backend and never trusted from the client.
- **Aggregate tiles without currency symbol** — the summary tiles on the invoice list (Total Revenue, Paid, Pending, Overdue, Draft) display plain numbers because the list supports multi-currency invoices and the tiles respond to the active status filter. Showing a currency symbol on a potentially mixed-currency sum would be misleading.

## Known Limitations

- Only one invoice line item is supported per invoice (the data model is designed to support multiple items in the future).
- No refresh tokens — the access token is the only credential; token refresh is out of scope.
- No role-based authorization — all authenticated users have the same permissions.
