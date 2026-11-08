#!/usr/bin/env bash
# Run ScopeWeaver natively (out of container) — same data, same skills, same sessions.
# Artex is STANDALONE, but storm (Henry's purple-team scanner) is WIRED to it for
# purple testing — reach it as http://host.docker.internal:2525 from native mode too
# (host.docker.internal is mapped to 127.0.0.1 in /etc/hosts, so container + native
# share the same URLs for bolt/storm/etc.).
# Postgres: pg published to 127.0.0.1:5433 by override (host's own postgres owns 5432).
# Stop the containerized app first:  docker compose stop scopeweaver
# Switch back to container:          pkill -f './artex' && docker compose start scopeweaver
set -euo pipefail
cd /mnt/Pandora/Agent80/Artex/scopeweaver

set -a
source .env
set +a

# Container-only hostnames -> loopback for the native process
export ARTEX_PG_DSN="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:5433/${POSTGRES_DB:-artex}?sslmode=disable"
export ARTEX_LLM_BASE_URL="${ARTEX_LLM_BASE_URL/host.docker.internal:20129/127.0.0.1:20129}"
export SCOPEWEAVER_LLM_BASE_URL="${SCOPEWEAVER_LLM_BASE_URL/host.docker.internal:20129/127.0.0.1:20129}"
export SCOPEWEAVER_LANGUAGE="${SCOPEWEAVER_LANGUAGE:-en}"

echo "[native] DSN: 127.0.0.1:5433  LLM: ${ARTEX_LLM_BASE_URL}  model: ${ARTEX_LLM_MODEL}"
export ARTEX_SKILL_DIR="$PWD/skills"
# Binary resolves data/ + jwt.key NEXT TO ITSELF (same layout as container /app),
# so it must live at repo root -> reuses ./data sessions and ./jwt.key.
if [ ! -x ./artex ] || [ ./bin/artex -nt ./artex ]; then
    cp -f bin/artex ./artex && chmod +x ./artex
fi
exec ./artex -addr :8787 -proxy :8788
