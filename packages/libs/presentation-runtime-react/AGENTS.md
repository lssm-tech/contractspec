# AI Agent Guide — `@contractspec/lib.presentation-runtime-react`

Scope: `packages/libs/presentation-runtime-react/*`

React presentation runtime with workflow components.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.presentation-runtime-core`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`.

## Architecture

- `src/index.ts` is the root public barrel and package entrypoint.
- `src/nativewind-env.d.ts` is part of the package's public or composition surface.
- `src/table.types.ts` is part of the package's public or composition surface.
- `src/table.utils.test.ts` is part of the package's public or composition surface.
- `src/table.utils.ts` is part of the package's public or composition surface.
- `src/useContractTable.models.tsx` is part of the package's public or composition surface.
- `src/useContractTable.tsx` is part of the package's public or composition surface.

## Public Surface

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

## Guardrails

- Workflow component API is consumed by bundles — breaking changes require coordinated updates.
- Must stay compatible with presentation-runtime-core interface.
- Hook signatures (`useWorkflow`) are public API; parameter changes are breaking.
- `useContractTable` and `useDataViewTable` must stay compatible with the React Native re-export boundary and the cross-surface policy documented at `/docs/libraries/cross-platform-ui`.
- If controller or table/data-view hook behavior changes, update the cross-platform UI docs and customer markdown kit in the same change.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.presentation-runtime-core`, `@contractspec/lib.ui-kit-web`, `@contractspec/tool.bun`.

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
