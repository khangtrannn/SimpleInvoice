#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# ── 1. Env file check ────────────────────────────────────────────────────────
if [[ ! -f "$ROOT_DIR/.env" ]]; then
  echo ".env not found — copying from .env.example"
  cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
fi

if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  echo "backend/.env not found — copying from backend/.env.example"
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
fi

# Load root env to resolve port variables for readiness checks
set -o allexport
# shellcheck disable=SC1091
source "$ROOT_DIR/.env"
set +o allexport

APP_PORT="${APP_PORT:-4000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

# ── 2. Start containers ───────────────────────────────────────────────────────
echo "Starting Docker services..."
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d --build

# ── 3. Wait for backend to be healthy ────────────────────────────────────────
echo "Waiting for backend to be ready..."
MAX_WAIT=60
ELAPSED=0
until docker exec simple_invoice_backend wget -qO- http://localhost:4000/health > /dev/null 2>&1; do
  if [[ $ELAPSED -ge $MAX_WAIT ]]; then
    echo "ERROR: backend did not become ready within ${MAX_WAIT}s."
    echo "Check logs with: docker compose logs backend"
    exit 1
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done
echo "Backend is ready."

# ── 4. Run migrations ─────────────────────────────────────────────────────────
echo "Running database migrations..."
docker exec simple_invoice_backend npm run migration:run:prod

# ── 5. Seed data ─────────────────────────────────────────────────────────────
echo "Seeding database..."
docker exec simple_invoice_backend npm run seed:prod

# ── 6. Wait for frontend to be healthy ───────────────────────────────────────
echo "Waiting for frontend to be ready..."
ELAPSED=0
until curl -sf "http://localhost:${FRONTEND_PORT}" > /dev/null 2>&1; do
  if [[ $ELAPSED -ge $MAX_WAIT ]]; then
    echo "ERROR: frontend did not become ready within ${MAX_WAIT}s."
    echo "Check logs with: docker compose logs frontend"
    exit 1
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done
echo "Frontend is ready."

# ── 7. Done ───────────────────────────────────────────────────────────────────
echo ""
echo "All done!"
echo "  Frontend : http://localhost:${FRONTEND_PORT}"
echo "  API      : http://localhost:${APP_PORT}"
echo "  API docs : http://localhost:${APP_PORT}/api/docs"
