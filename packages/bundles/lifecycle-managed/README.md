# @contractspec/bundle.lifecycle-managed

Website: https://contractspec.io

**Lifecycle management bundle with analytics and AI advisor.**

## What It Provides

- **Layer**: bundle.
- **Consumers**: `examples/lifecycle-cli`.
- `src/services/` contains business logic services and workflows.
- Related ContractSpec packages include `@contractspec/lib.analytics`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/lib.observability`, `@contractspec/module.lifecycle-advisor`, `@contractspec/module.lifecycle-core`, ...
- `src/services/` contains business logic services and workflows.

## Installation

`npm install @contractspec/bundle.lifecycle-managed`

or

`bun add @contractspec/bundle.lifecycle-managed`

## Usage

Import the root entrypoint from `@contractspec/bundle.lifecycle-managed`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/services/` -- assessment service (lifecycle evaluation logic).
- `src/agents/` -- AI lifecycle advisor agent.
- `src/events/` -- lifecycle domain events.
- `src/api/` -- REST handler adapters.
- `src/__tests__/` -- unit tests.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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
- Resolve lint, build, and type errors across nine packages.
- Add first-class transport, auth, versioning, and BYOK support across all integrations.

## Notes

- Depends on six workspace packages (`lib.analytics`, `lib.contracts-spec`, `lib.lifecycle`, `lib.observability`, `module.lifecycle-advisor`, `module.lifecycle-core`); changes to those APIs propagate here.
- Events must remain serializable for cross-service consumption.
- Keep REST handlers thin; domain logic belongs in services.
