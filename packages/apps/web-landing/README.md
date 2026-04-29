# @contractspec/app.web-landing

**Next.js delivery shell for the public ContractSpec website: marketing, docs, registry pages, `/llms*`, and selected operate/sandbox surfaces.**

## What It Does

- Owns the app shell, metadata, OG generation, route wrappers, and public site delivery.
- Publishes the marketing experience while delegating most page-body composition to `@contractspec/bundle.marketing`.
- Serves docs, registry, sandbox, and operate surfaces while keeping their shared shell consistent with the public brand system.
- Shares example preview rendering across docs, `/templates`, and `/sandbox`, with rich UI for UI-backed examples and fallback cards for the rest of the discoverable catalog.
- Publishes `/llms`, `/llms.txt`, `/llms-full.txt`, and package-specific `/llms/[slug]` endpoints for agent-friendly repo guidance.
- Documents design-system adoption guidance for shared interaction patterns such as `ObjectReferenceHandler` and `AdaptivePanel`, including human-readable docs and agent-facing `/llms*` prompts.
- Documents ContractSpec translation runtime guidance, including the optional i18next adapter, SSR/hydration rules, production checks, and an agent implementation prompt.
- Documents data-exchange flexible import-template guidance at `/docs/guides/data-exchange-import-templates`, including developer templates, user remapping flows, server dry-runs, format profiles, verification commands, and copy-ready prompts.

## Architecture

- `src/app/` contains route groups for marketing, docs, sandbox, operate, registry, and API endpoints.
- `src/components/` contains app-local shell concerns such as header, footer, SEO helpers, and local route UI.
- `public/llms*.txt` contains machine-readable monorepo guidance exposed directly from the site.
- `scripts/generate-llms-full.mjs` regenerates the public aggregated README corpus used by `/llms-full.txt`.

This package should stay thin:
- marketing page narratives belong in `@contractspec/bundle.marketing`
- docs and library composition belong in `@contractspec/bundle.library`
- shared reusable UI primitives belong in lower layers

## Public Entry Points

- Web routes under `/`, `/product`, `/pricing`, `/templates`, `/contact`, `/changelog`, `/docs/*`, `/sandbox`, `/operate/*`, and registry surfaces.
- Agent-facing discovery surfaces under `/llms`, `/llms.txt`, `/llms-full.txt`, and `/llms/[slug]`.
- API endpoints under `src/app/api/*`, including OG and MCP/chat-related surfaces used by the public site.

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

## Notes

- Route changes here affect SEO, external links, and agent-discovery flows; keep URL stability high.
- Branding changes in this package must stay aligned with root docs, generated root AGENTS content, and `public/llms.txt`.
- When updating the public shell, verify that docs and `/llms*` remain readable; this package serves more than the marketing homepage.
- Keep `/docs/libraries/design-system` and `/llms/lib.design-system` aligned when documenting object references, adaptive panels, or other interaction primitives that downstream apps should adopt consistently.
- Keep `/docs/libraries/translation-runtime`, `/llms/[lib.translation-runtime]`, and `@contractspec/lib.translation-runtime` README guidance aligned when documenting i18n runtime or adapter behavior.
- Keep `/docs/guides/data-exchange-import-templates`, `/llms/lib.data-exchange-core`, `/llms/lib.data-exchange-client`, and `/llms/lib.data-exchange-server` aligned when documenting import templates, flexible column mapping, dry-runs, or mapping-review prompts.
