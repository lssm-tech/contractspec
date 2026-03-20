# AI Agent Guide — `@contractspec/bundle.marketing`

Scope: `packages/bundles/marketing/*`

Marketing bundle with docs, email templates, and landing page components.

## Quick Context

- Layer: `bundle`.
- Package visibility: published package.
- Primary consumers are apps and higher-level composed product surfaces.
- Related packages: `@contractspec/bundle.library`, `@contractspec/example.agent-console`, `@contractspec/example.analytics-dashboard`, `@contractspec/example.crm-pipeline`, `@contractspec/example.integration-hub`, `@contractspec/example.marketplace`, ...

## Architecture

- `src/components/docs/` — Documentation pages.
- `src/components/marketing/` — Landing page sections.
- `src/components/templates/` — Template preview.
- `src/libs/email/` — Email templates and utilities.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./bundles` resolves through `./src/bundles/index.ts`.
- Export `./bundles/MarketingBundle` resolves through `./src/bundles/MarketingBundle.ts`.
- Export `./components/marketing` resolves through `./src/components/marketing/index.ts`.
- Export `./components/marketing/ChangelogPage` resolves through `./src/components/marketing/ChangelogPage.tsx`.
- Export `./components/marketing/CofounderPage` resolves through `./src/components/marketing/CofounderPage.tsx`.
- Export `./components/marketing/ContactClient` resolves through `./src/components/marketing/ContactClient.tsx`.
- Export `./components/marketing/ContributePage` resolves through `./src/components/marketing/ContributePage.tsx`.
- Export `./components/marketing/DesignPartnerPage` resolves through `./src/components/marketing/DesignPartnerPage.tsx`.
- Export `./components/marketing/LandingPage` resolves through `./src/components/marketing/LandingPage.tsx`.
- The package publishes 45 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Landing page sections are composed by `app.web-landing` — keep component props stable.
- Email templates must render correctly in major email clients; test with Litmus or equivalent.
- Do not import from other bundles except through shared lib interfaces.
- Changes here can affect downstream packages such as `@contractspec/bundle.library`, `@contractspec/example.agent-console`, `@contractspec/example.analytics-dashboard`, `@contractspec/example.crm-pipeline`, `@contractspec/example.integration-hub`, `@contractspec/example.marketplace`, ....

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
