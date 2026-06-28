#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REMOVE_VOLUMES=false
for arg in "$@"; do
  case "$arg" in
    --volumes|-v) REMOVE_VOLUMES=true ;;
    *) echo "Unknown argument: $arg" && exit 1 ;;
  esac
done

if $REMOVE_VOLUMES; then
  echo "Stopping Docker services and removing volumes..."
  docker compose -f "$ROOT_DIR/docker-compose.yml" down --volumes
else
  echo "Stopping Docker services..."
  docker compose -f "$ROOT_DIR/docker-compose.yml" down
fi

echo "Done."
