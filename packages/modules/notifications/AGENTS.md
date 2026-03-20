# AI Agent Guide — `@contractspec/module.notifications`

Scope: `packages/modules/notifications/*`

Notification center module for ContractSpec applications.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.bus`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/channels` is part of the package's public or composition surface.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/entities/` contains domain entities and value objects.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/notifications.capability.ts` defines a capability surface.
- `src/notifications.feature.ts` defines a feature entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./channels` resolves through `./src/channels/index.ts`.
- Export `./contracts` resolves through `./src/contracts/index.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./i18n` resolves through `./src/i18n/index.ts`.
- Export `./i18n/catalogs` resolves through `./src/i18n/catalogs/index.ts`.
- Export `./i18n/catalogs/en` resolves through `./src/i18n/catalogs/en.ts`.
- Export `./i18n/catalogs/es` resolves through `./src/i18n/catalogs/es.ts`.
- Export `./i18n/catalogs/fr` resolves through `./src/i18n/catalogs/fr.ts`.
- Export `./i18n/keys` resolves through `./src/i18n/keys.ts`.
- The package publishes 15 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Depends on `lib.bus` for event dispatch -- channel adapters must not send directly.
- i18n catalogs must stay in sync across all supported locales (en, es, fr).
- Templates are the single source for notification content; do not inline message strings.
- Changes here can affect downstream packages such as `@contractspec/lib.bus`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
