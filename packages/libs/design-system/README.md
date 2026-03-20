# @contractspec/lib.design-system

Website: https://contractspec.io

**Design tokens and theming primitives.**

## What It Provides

- **Layer**: lib.
- **Consumers**: accessibility, presentation-runtime-react, video-gen, bundles, apps.
- Related ContractSpec packages include `@contractspec/lib.ai-agent`, `@contractspec/lib.contracts-runtime-client-react`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.presentation-runtime-react`, `@contractspec/lib.ui-kit`, ...

## Installation

`npm install @contractspec/lib.design-system`

or

`bun add @contractspec/lib.design-system`

## Usage

Import the root entrypoint from `@contractspec/lib.design-system`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/components/` contains reusable UI components and view composition.
- `src/hooks/` contains custom hooks for host applications.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/lib/` contains package-local helper utilities and adapters.
- `src/platform` is part of the package's public or composition surface.
- `src/renderers` is part of the package's public or composition surface.
- `src/theme` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test --pass-with-no-tests
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit -p tsconfig.build.json
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run registry:build` — bun run scripts/build-registry.ts
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add data visualization capabilities.
- Add table capabilities.
- Resolve lint, build, and type errors across nine packages.
- Add AI provider ranking system with ranking-driven model selection.
- Stabilize marketing header interactions.

## Notes

- **High blast radius** — all UI surfaces depend on design tokens; treat token names and values as public API.
- Component hierarchy must be preserved; do not flatten or restructure without coordinating downstream consumers.
- Token removals or renames are breaking changes.
