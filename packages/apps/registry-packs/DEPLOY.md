# Deploy `@contractspec/app.registry-packs` to Vercel

This service is an Elysia API. For production on Vercel, use:

- PostgreSQL (`DB_DRIVER=pg`)
- S3-compatible storage (`STORAGE_BACKEND=s3`)

Do **not** use SQLite/local filesystem in production on Vercel (ephemeral disk).

## 1) Environment variables

Use `env.example` in this folder as the source of truth.

Minimum production set:

- `DB_DRIVER=pg`
- `DATABASE_URL=<your managed postgres url>`
- `STORAGE_BACKEND=s3`
- `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`
- `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`

Optional but recommended:

- `RATE_LIMIT_WINDOW`, `RATE_LIMIT_GENERAL`, `RATE_LIMIT_PUBLISH`
- `GITHUB_WEBHOOK_SECRET`, `GITHUB_REPO_PACK_MAP` (if GitHub auto-publish is used)

## 2) Prepare PostgreSQL migrations (required)

This app auto-runs PG migrations at startup **only if** `src/db/migrations-pg` exists.

From `packages/apps/registry-packs`:

```bash
bun install
bun run db:generate:pg
bun run db:migrate:pg
```

Notes:

- Run these commands with `DATABASE_URL` pointing to your target PostgreSQL instance.
- Commit generated `src/db/migrations-pg` files so deployments can run auto-migrate.

## 3) Vercel function entrypoint (recommended)

For Vercel Functions, expose the app through `api/index.ts` and call `app.handle()`.

Create `api/index.ts`:

```ts
import { initDb } from "../src/db/client";
import { app } from "../src/server";

let initPromise: Promise<unknown> | null = null;

function ensureInit() {
  if (!initPromise) {
    initPromise = initDb();
  }
  return initPromise;
}

export default {
  async fetch(request: Request) {
    await ensureInit();
    return app.handle(request);
  },
};
```

Keep `src/index.ts` for local server mode (`bun run dev`).

## 4) `vercel.json` setup

Use a single catch-all route to the function entrypoint:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "bunVersion": "1.x",
  "routes": [{ "src": "/(.*)", "dest": "/api/index.ts" }]
}
```

If you already use `relatedProjects`, keep it in the same file.

## 5) Vercel project settings

Recommended:

- Framework preset: `Other`
- Root directory: `packages/apps/registry-packs`
- Install command: `bun install`
- Build command: none required for `api/*.ts` function mode (or `bun run build` if you also need `dist/` artifacts)

Then add all production env vars in Vercel Project Settings and deploy.

## 6) Verify after deploy

Run these checks against your deployment URL:

```bash
curl https://<your-deployment>/health
curl https://<your-deployment>/stats
curl https://<your-deployment>/featured
```

Expected:

- `/health` returns `{ "status": "healthy" }`
- `/stats` returns non-error JSON
- `/featured` returns `{ "packs": [...] }`

## 7) Common pitfalls

- `DB_DRIVER=sqlite` on Vercel: data is not durable.
- `STORAGE_BACKEND=local` on Vercel: tarballs are not durable.
- Missing `src/db/migrations-pg`: startup may skip PG migration.
- Invalid JSON in `GITHUB_REPO_PACK_MAP`: integration silently falls back to empty map.
- In-memory rate limiting is per-instance, not globally shared across all function instances.
