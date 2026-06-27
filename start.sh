#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"

# ── 1. Env file check ────────────────────────────────────────────────────────
if [[ ! -f "$BACKEND_DIR/.env" ]]; then
  echo "backend/.env not found — copying from .env.example"
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  echo "Please review backend/.env and fill in any missing values, then re-run this script."
  exit 1
fi

# ── 2. Start containers ───────────────────────────────────────────────────────
echo "Starting Docker services..."
docker compose -f "$ROOT_DIR/docker-compose.yml" up -d --build

# ── 3. Wait for backend to be healthy ────────────────────────────────────────
echo "Waiting for backend to be ready..."
MAX_WAIT=60
ELAPSED=0
until docker exec simple_invoice_backend wget -qO- http://localhost:4000/health > /dev/null 2>&1; do
  if [[ $ELAPSED -ge $MAX_WAIT ]]; then
    echo "Backend did not become ready within ${MAX_WAIT}s. Check logs with: docker compose logs backend"
    exit 1
  fi
  sleep 2
  ELAPSED=$((ELAPSED + 2))
done

# ── 4. Run migrations ─────────────────────────────────────────────────────────
echo "Running database migrations..."
docker exec simple_invoice_backend npm run migration:run

# ── 5. Seed data ─────────────────────────────────────────────────────────────
echo "Seeding database..."
docker exec simple_invoice_backend npm run seed

echo ""
echo "All done! The app is running at http://localhost:4000"
echo "API docs available at http://localhost:4000/api/docs"
