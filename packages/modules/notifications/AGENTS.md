# AI Agent Guide — `@contractspec/module.notifications`

Scope: `packages/modules/notifications/*`

Compatibility shim for the former notification center module package.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.bus`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/channels` re-exports channel helpers from `@contractspec/lib.notification`.
- `src/contracts/` re-exports canonical contracts from `@contractspec/lib.contracts-spec/notifications`.
- `src/entities/` re-exports notification entities from `@contractspec/lib.notification` while preserving the legacy schema contribution id.
- `src/i18n` re-exports i18n helpers from `@contractspec/lib.notification`.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/notifications.capability.ts` re-exports the canonical capability surface.
- `src/notifications.feature.ts` preserves compatibility metadata with `meta.key === "modules.notifications"`.

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
- The package publishes 18 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Do not reintroduce runtime implementation here; add reusable notification runtime code to `@contractspec/lib.notification`.
- Keep `notificationsSchemaContribution.moduleId === "@contractspec/module.notifications"`.
- Keep `NotificationsFeature.meta.key === "modules.notifications"`.
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
