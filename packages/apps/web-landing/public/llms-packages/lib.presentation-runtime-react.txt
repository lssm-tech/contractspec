# @contractspec/lib.presentation-runtime-react

Website: https://contractspec.io

**React presentation runtime with workflow components.**

## What It Provides

- **Layer**: lib.
- **Consumers**: bundles, apps.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.presentation-runtime-core`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.presentation-runtime-core`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`.

## Installation

`npm install @contractspec/lib.presentation-runtime-react`

or

`bun add @contractspec/lib.presentation-runtime-react`

## Usage

Import the root entrypoint from `@contractspec/lib.presentation-runtime-react`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/nativewind-env.d.ts` is part of the package's public or composition surface.
- `src/table.types.ts` is part of the package's public or composition surface.
- `src/table.utils.test.ts` is part of the package's public or composition surface.
- `src/table.utils.ts` is part of the package's public or composition surface.
- `src/useContractTable.models.tsx` is part of the package's public or composition surface.
- `src/useContractTable.tsx` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./nativewind-env.d` resolves through `./src/nativewind-env.d.ts`.
- Export `./table.types` resolves through `./src/table.types.ts`.
- Export `./table.utils` resolves through `./src/table.utils.ts`.
- Export `./useContractTable` resolves through `./src/useContractTable.tsx`.
- Export `./useContractTable.models` resolves through `./src/useContractTable.models.tsx`.
- Export `./useDataViewTable` resolves through `./src/useDataViewTable.tsx`.
- Export `./useVisualizationModel` resolves through `./src/useVisualizationModel.ts`.
- Export `./useWorkflow` resolves through `./src/useWorkflow.ts`.
- Export `./WorkflowStepper` resolves through `./src/WorkflowStepper.tsx`.
- The package publishes 11 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit -p tsconfig.json
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Add data visualization capabilities.
- Add table capabilities.
- Propagate DataView table overflow metadata through `useDataViewTable` so
  renderers can truncate, wrap, expand, or initially hide columns consistently.

## Notes

- Workflow component API is consumed by bundles — breaking changes require coordinated updates.
- Must stay compatible with presentation-runtime-core interface.
- Hook signatures (`useWorkflow`) are public API; parameter changes are breaking.
