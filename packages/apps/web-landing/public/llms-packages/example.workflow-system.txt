# @contractspec/example.workflow-system

Website: https://contractspec.io

**Workflow and approval system example for ContractSpec - State machine with role-based transitions.**

## What This Demonstrates

- State machine pattern for workflow transitions.
- Approval flow with role-based access.
- Multi-entity domain (workflow, instance, approval).
- Per-entity schema/enum/event/handler/operations pattern.
- React UI with WorkflowDashboard, hooks, and renderers.
- Contract-backed visualizations for workflow status, throughput, and workload comparison.
- Capability and feature definition patterns.
- Seeder and test-spec patterns.

## Running Locally

From `packages/examples/workflow-system`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.workflow-system` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/approval` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/instance` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./approval` resolves through `./src/approval/index.ts`.
- Export `./approval/approval.enum` resolves through `./src/approval/approval.enum.ts`.
- Export `./approval/approval.event` resolves through `./src/approval/approval.event.ts`.
- Export `./approval/approval.handler` resolves through `./src/approval/approval.handler.ts`.
- Export `./approval/approval.operations` resolves through `./src/approval/approval.operations.ts`.
- Export `./approval/approval.schema` resolves through `./src/approval/approval.schema.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/workflow-system.docblock` resolves through `./src/docs/workflow-system.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- The package publishes 44 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
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
- `bun run test` — bun test

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, ...
