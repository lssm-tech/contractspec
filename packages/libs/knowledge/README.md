# @contractspec/lib.knowledge

Website: https://contractspec.io

**RAG and knowledge base primitives.**

## What It Provides

- **Layer**: lib.
- **Consumers**: ai-agent, personalization, support-bot, jobs, bundles.
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.knowledge`

or

`bun add @contractspec/lib.knowledge`

## Usage

Import the root entrypoint from `@contractspec/lib.knowledge`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/access` is part of the package's public or composition surface.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/ingestion` is part of the package's public or composition surface.
- `src/query` is part of the package's public or composition surface.
- `src/retriever` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./access` resolves through `./src/access/index.ts`.
- Export `./access/guard` resolves through `./src/access/guard.ts`.
- Export `./i18n` resolves through `./src/i18n/index.ts`.
- Export `./i18n/catalogs` resolves through `./src/i18n/catalogs/index.ts`.
- Export `./i18n/catalogs/en` resolves through `./src/i18n/catalogs/en.ts`.
- Export `./i18n/catalogs/es` resolves through `./src/i18n/catalogs/es.ts`.
- Export `./i18n/catalogs/fr` resolves through `./src/i18n/catalogs/fr.ts`.
- Export `./i18n/keys` resolves through `./src/i18n/keys.ts`.
- Export `./i18n/locale` resolves through `./src/i18n/locale.ts`.
- The package publishes 24 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test --pass-with-no-tests
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
- Add full i18n support across all 10 packages (en/fr/es, 460 keys).

## Notes

- High blast radius — retriever interface is consumed by multiple AI libs.
- Ingestion pipeline must stay idempotent; re-ingesting the same document must not create duplicates.
- Type changes ripple into ai-agent, personalization, and support-bot.
