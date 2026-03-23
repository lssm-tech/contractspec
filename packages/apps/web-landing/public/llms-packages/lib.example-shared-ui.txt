# @contractspec/lib.example-shared-ui

**Shared React components and hooks for ContractSpec example apps. Provides the common layout, editors, and overlays used across all examples.**

## What It Provides

- **Layer**: lib.
- **Consumers**: example apps.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.surface-runtime`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.surface-runtime`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Installation

`npm install @contractspec/lib.example-shared-ui`

or

`bun add @contractspec/lib.example-shared-ui`

## Usage

Import the root entrypoint from `@contractspec/lib.example-shared-ui`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/bundles/` contains bundle definitions and composition entrypoints.
- `src/EvolutionDashboard.tsx` is part of the package's public or composition surface.
- `src/EvolutionSidebar.tsx` is part of the package's public or composition surface.
- `src/hooks/` contains custom hooks for host applications.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/lib/` contains package-local helper utilities and adapters.
- `src/LocalDataIndicator.tsx` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./bundles` resolves through `./src/bundles/index.ts`.
- Export `./bundles/ExampleTemplateBundle` resolves through `./src/bundles/ExampleTemplateBundle.ts`.
- Export `./EvolutionDashboard` resolves through `./src/EvolutionDashboard.tsx`.
- Export `./EvolutionSidebar` resolves through `./src/EvolutionSidebar.tsx`.
- Export `./hooks` resolves through `./src/hooks/index.ts`.
- Export `./hooks/useBehaviorTracking` resolves through `./src/hooks/useBehaviorTracking.ts`.
- Export `./hooks/useEvolution` resolves through `./src/hooks/useEvolution.ts`.
- Export `./hooks/useRegistryTemplates` resolves through `./src/hooks/useRegistryTemplates.ts`.
- Export `./hooks/useSpecContent` resolves through `./src/hooks/useSpecContent.ts`.
- The package publishes 26 total export subpaths; keep docs aligned with `package.json`.

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
- Contracts context, bundle exports, surface-runtime docs.

## Notes

- Low blast radius — only example apps depend on this package.
- `TemplateShell` is the shared layout for all examples; structural changes affect every example app.
