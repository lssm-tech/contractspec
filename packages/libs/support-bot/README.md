# @contractspec/lib.support-bot

Website: https://contractspec.io

**AI support bot framework with RAG and ticket management.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles.
- Related ContractSpec packages include `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, ...

## Installation

`npm install @contractspec/lib.support-bot`

or

`bun add @contractspec/lib.support-bot`

## Usage

Import the root entrypoint from `@contractspec/lib.support-bot`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/bot` is part of the package's public or composition surface.
- `src/i18n` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/rag` is part of the package's public or composition surface.
- `src/spec.ts` is part of the package's public or composition surface.
- `src/tickets` is part of the package's public or composition surface.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./bot` resolves through `./src/bot/index.ts`.
- Export `./bot/auto-responder` resolves through `./src/bot/auto-responder.ts`.
- Export `./bot/feedback-loop` resolves through `./src/bot/feedback-loop.ts`.
- Export `./bot/tools` resolves through `./src/bot/tools.ts`.
- Export `./i18n` resolves through `./src/i18n/index.ts`.
- Export `./i18n/catalogs` resolves through `./src/i18n/catalogs/index.ts`.
- Export `./i18n/catalogs/en` resolves through `./src/i18n/catalogs/en.ts`.
- Export `./i18n/catalogs/es` resolves through `./src/i18n/catalogs/es.ts`.
- Export `./i18n/catalogs/fr` resolves through `./src/i18n/catalogs/fr.ts`.
- The package publishes 19 total export subpaths; keep docs aligned with `package.json`.

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
- Resolve lint/test regressions after voice capability updates.
- Add full i18n support across all 10 packages (en/fr/es, 460 keys).

## Notes

- Bot spec interface follows ai-agent patterns — keep aligned with contracts-spec.
- Ticket schema is shared — changes affect consumers downstream.
- RAG pipeline must stay compatible with the knowledge lib.
