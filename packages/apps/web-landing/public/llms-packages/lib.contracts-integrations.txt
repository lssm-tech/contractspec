# @contractspec/lib.contracts-integrations

**Integration contract definitions for external services.**

## What It Provides

- **Layer**: lib.
- **Consumers**: content-gen, image-gen, voice, jobs, metering, analytics, observability, support-bot.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.contracts-integrations`

or

`bun add @contractspec/lib.contracts-integrations`

## Usage

Import the root entrypoint from `@contractspec/lib.contracts-integrations`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/integrations` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./integrations` resolves through `./src/integrations/index.ts`.
- Export `./integrations/auth` resolves through `./src/integrations/auth.ts`.
- Export `./integrations/auth-helpers` resolves through `./src/integrations/auth-helpers.ts`.
- Export `./integrations/binding` resolves through `./src/integrations/binding.ts`.
- Export `./integrations/byok` resolves through `./src/integrations/byok.ts`.
- Export `./integrations/connection` resolves through `./src/integrations/connection.ts`.
- Export `./integrations/docs/integrations.docblock` resolves through `./src/integrations/docs/integrations.docblock.ts`.
- Export `./integrations/health` resolves through `./src/integrations/health.ts`.
- Export `./integrations/health/contracts` resolves through `./src/integrations/health/contracts/index.ts`.
- The package publishes 121 total export subpaths; keep docs aligned with `package.json`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Resolve lint and build errors in workspace bundle and integrations lib.
- Missing contract layers.
- Resolve lint, build, and type errors across nine packages.
- Normalize formatting across contracts-integrations, composio, and observability.
- Add Composio universal fallback, fix provider-ranking types, and expand package exports.

## Notes

- High blast radius — integration contracts are consumed by many libs.
- Provider and secret catalog schemas must stay backward-compatible.
- Adding a new integration must not break existing subpath imports.
