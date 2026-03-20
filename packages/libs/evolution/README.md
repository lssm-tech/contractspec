# @contractspec/lib.evolution

Website: https://contractspec.io

**AI-powered contract evolution engine.**

## What It Provides

- **Layer**: lib.
- **Consumers**: example-shared-ui, bundles.
- **Key dependencies**: ai-agent, contracts-spec, lifecycle, observability, schema.
- Related ContractSpec packages include `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/lib.observability`, ...

## Installation

`npm install @contractspec/lib.evolution`

or

`bun add @contractspec/lib.evolution`

## Usage

Import the root entrypoint from `@contractspec/lib.evolution`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/analyzer` is part of the package's public or composition surface.
- `src/approval` is part of the package's public or composition surface.
- `src/generator` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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
- Add changesets and apply pending fixes.
- Resolve lint, build, and type errors across nine packages.
- Add AI provider ranking system with ranking-driven model selection.

## Notes

- Evolution strategies affect contract migration paths; changes can break existing migrations.
- Depends on multiple core libs — verify compatibility when updating any dependency.
- Strategy selection logic must remain deterministic and auditable.
