# @contractspec/module.notifications

Website: https://contractspec.io

**Notification center module for ContractSpec applications.**

## What It Provides

- **Layer**: module.
- **Consumers**: bundles (library, contractspec-studio), apps (web-landing).
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- Related ContractSpec packages include `@contractspec/lib.bus`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.

## Installation

`npm install @contractspec/module.notifications`

or

`bun add @contractspec/module.notifications`

## Usage

Import the root entrypoint from `@contractspec/module.notifications`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/channels` is part of the package's public or composition surface.
- `src/contracts/` contains contract specs, operations, entities, and registry exports.
- `src/entities/` contains domain entities and value objects.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/notifications.capability.ts` defines a capability surface.
- `src/notifications.feature.ts` defines a feature entrypoint.

## Public Entry Points

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Fix small issues.
- Add full i18n support across all 10 packages (en/fr/es, 460 keys).

## Notes

- Depends on `lib.bus` for event dispatch -- channel adapters must not send directly.
- i18n catalogs must stay in sync across all supported locales (en, es, fr).
- Templates are the single source for notification content; do not inline message strings.
