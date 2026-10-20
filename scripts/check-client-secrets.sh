#!/usr/bin/env bash
#
# Fail the build if any server-only secret reference appears in the
# client-shipped output bundle.
#
# Background:
#   Next.js does NOT inline non-`NEXT_PUBLIC_*` env vars into the client
#   bundle — but a buggy import or a hard-coded string literal CAN leak
#   the env var name (or a typo of the value) into static JS. This guard
#   catches that at build time, before anything reaches a browser.
#
# Scope:
#   Greps `.next/static/**` (client-served) for server-only env names.
#   `.next/server/**` is intentionally NOT checked — server bundles
#   legitimately reference these vars.
#
# Usage:
#   ./scripts/check-client-secrets.sh
#   Exit 0 = clean. Exit 1 = leak detected.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATIC_DIR="$ROOT/.next/static"

if [ ! -d "$STATIC_DIR" ]; then
  echo "❌ $STATIC_DIR not found. Run \`npm run build\` first." >&2
  exit 2
fi

# Server-only secret env vars. Keep in sync with the server schema in
# website/lib/env.ts.
SERVER_ONLY_SECRETS=(
  "SUPABASE_SERVICE_ROLE_KEY"
  "SANITY_API_READ_TOKEN"
  "SANITY_WEBHOOK_SECRET"
  "RESEND_API_KEY"
  "WEBSITE_ENQUIRY_FROM"
)

FOUND=0
for pattern in "${SERVER_ONLY_SECRETS[@]}"; do
  # -r recursive, -l filenames only, -F fixed string (no regex).
  if matches=$(grep -rlF "$pattern" "$STATIC_DIR" 2>/dev/null); then
    if [ -n "$matches" ]; then
      echo "❌ Server-only env reference '$pattern' found in client bundle:"
      echo "$matches" | sed 's|^|   |'
      FOUND=1
    fi
  fi
done

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo "Server-only secrets must never appear in .next/static/. Fix by:"
  echo "  1. Removing any process.env.<SECRET> reference from a client-rendered file"
  echo "  2. Moving the calling code to a server component or API route"
  echo "  3. Using getServerEnv() from lib/env.ts in server modules only"
  exit 1
fi

echo "✅ Client bundle clean of server-only env references"
echo "   Checked: ${SERVER_ONLY_SECRETS[*]}"
echo "   In: $STATIC_DIR"
