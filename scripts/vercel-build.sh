#!/bin/sh
# Vercel build. Production deploys the Convex functions, then builds the site
# with the production Convex URL. Previews only build the site: without
# PUBLIC_CONVEX_URL the profile page says it is unavailable.
set -eu

if [ "${VERCEL_ENV:-}" = "production" ]; then
  exec npx convex deploy --cmd 'pnpm build' --cmd-url-env-var-name PUBLIC_CONVEX_URL
fi

exec pnpm build
