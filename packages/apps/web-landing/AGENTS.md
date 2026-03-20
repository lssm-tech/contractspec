# AI Agent Guide — `@contractspec/app.web-landing`

Scope: `packages/apps/web-landing/*`

Next.js delivery shell for the public ContractSpec website: marketing, docs, registry pages, `/llms*`, and selected operate/sandbox surfaces.

## Quick Context

- Layer: `app`
- Package visibility: private workspace package
- Primary consumers: external web visitors, doc readers, agent clients fetching `/llms*`, and internal/product users hitting selected operate or sandbox routes
- Main related packages: `@contractspec/bundle.marketing`, `@contractspec/bundle.library`, `@contractspec/lib.design-system`

## Architecture

- `src/app/` owns route wrappers, metadata, route grouping, and public API endpoints.
- `src/components/` owns app-local shell concerns such as header, footer, local SEO helpers, and route-specific composition that should not live in reusable bundles.
- `public/llms*.txt` is the machine-readable public repo guide; keep it consistent with root docs and package READMEs.
- `scripts/generate-llms-full.mjs` regenerates the public README corpus for `/llms-full.txt`.

## Public Surface

- Public marketing routes including `/`, `/product`, `/pricing`, `/templates`, `/contact`, and `/changelog`
- Docs, sandbox, registry, and operate routes delivered from the same app shell
- `/llms`, `/llms.txt`, `/llms-full.txt`, and `/llms/[slug]`
- API routes under `src/app/api/*`

## Guardrails

- Keep this app thin. Route wrappers, shell, metadata, and public delivery belong here; reusable marketing narratives belong in `@contractspec/bundle.marketing`.
- Treat route stability, metadata, OG output, and `/llms*` behavior as public compatibility surfaces.
- Branding changes here must stay aligned with root `README.md`, root AGENTS source packs, and `public/llms.txt`.
- When changing the shell or global styles, verify that docs and non-marketing surfaces still render clearly; this app is not only a homepage.

## Local Commands

- `bun run dev` — bun --bun next dev
- `bun run start` — bun --bun next start
- `bun run build` — bun run llms:generate && bun --bun next build
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run clean` — rimraf .next dist .turbo
- `bun run llms:generate` — bun scripts/generate-llms-full.mjs
- `bun run build:types` — tsc --noEmit
