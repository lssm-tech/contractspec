# AI Agent Guide — `@contractspec/bundle.marketing`

Scope: `packages/bundles/marketing/*`

Marketing composition bundle for the public ContractSpec site: landing narratives, product/pricing/templates pages, support pages, and email-facing marketing helpers.

## Quick Context

- Layer: `bundle`
- Package visibility: published package
- Primary consumers: `@contractspec/app.web-landing` and other higher-level product surfaces that need the public marketing pages or marketing utilities
- Main related packages: `@contractspec/app.web-landing`, `@contractspec/bundle.library`, `@contractspec/lib.design-system`

## Architecture

- `src/components/marketing/` owns page-level narratives and marketing composition.
- `src/content/` owns React-free story data shared by web and mobile shells.
- `src/components/templates/` owns scenario/template browsing, preview, and template acquisition flows.
- `src/libs/email/` owns contact, newsletter, and waitlist logic used by marketing surfaces.
- `src/index.ts` is the root public barrel; keep exported stories stable when they are consumed by app shells.

## Public Surface

- Marketing pages under `./components/marketing/*`
- Platform-neutral story data under `./content`
- Templates surfaces under `./components/templates/*`
- Email/contact helpers under `./libs/email/*`

## Guardrails

- This package owns story and composition, not route metadata or the outer app shell; those stay in `@contractspec/app.web-landing`.
- Public category language matters here. Keep ContractSpec positioned as the open spec system and Studio as the operating product on top.
- When updating template or marketing flows, preserve the OSS-first -> Studio-second adoption story unless product direction explicitly changes.
- If you materially change page structure or positioning, update the package README/AGENTS and coordinate with app-level docs and `/llms*`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
