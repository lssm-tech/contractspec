# AI Agent Guide — `@contractspec/lib.presentation-runtime-react-native`

Scope: `packages/libs/presentation-runtime-react-native/*`

React Native presentation runtime for mobile apps.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.presentation-runtime-core`, `@contractspec/lib.presentation-runtime-react`, `@contractspec/lib.ui-kit`, `@contractspec/tool.bun`.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/nativewind-env.d.ts` is part of the package's public or composition surface.
- `src/useContractTable.ts` is part of the package's public or composition surface.
- `src/useDataViewTable.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./nativewind-env.d` resolves through `./src/nativewind-env.d.ts`.
- Export `./useContractTable` resolves through `./src/useContractTable.ts`.
- Export `./useDataViewTable` resolves through `./src/useDataViewTable.ts`.

## Guardrails

- Must stay compatible with presentation-runtime-core; do not diverge from the shared interface.
- NativeWind integration is platform-specific — changes must be tested on actual devices/simulators.
- Avoid web-only APIs; all code must run in React Native's JavaScript environment.
- Changes here can affect downstream packages such as `@contractspec/lib.presentation-runtime-core`, `@contractspec/lib.presentation-runtime-react`, `@contractspec/lib.ui-kit`, `@contractspec/tool.bun`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit -p tsconfig.json
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
