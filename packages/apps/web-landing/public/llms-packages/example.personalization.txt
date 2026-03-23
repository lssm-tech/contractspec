# @contractspec/example.personalization

Website: https://contractspec.io

**Personalization examples: behavior tracking, overlay customization, workflow extension.**

## What This Demonstrates

- Behavior tracking integration pattern.
- Canonical `experiment` export via `PersonalizationExperiment`.
- Overlay customization via overlay-engine.
- Canonical `theme` export via `PersonalizationTheme`.
- Workflow extension via workflow-composer.
- Multi-lib composition in a single example.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/personalization`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.personalization` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/behavior-tracking.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/overlay-customization.ts` is part of the package's public or composition surface.
- `src/personalization.experiment.ts` defines the exported experiment spec.
- `src/personalization.feature.ts` defines a feature entrypoint.
- `src/personalization.theme.ts` defines the exported theme spec.
- `src/workflow-extension.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./behavior-tracking` resolves through `./src/behavior-tracking.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/personalization.docblock` resolves through `./src/docs/personalization.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./overlay-customization` resolves through `./src/overlay-customization.ts`.
- Export `./personalization.experiment` resolves through `./src/personalization.experiment.ts`.
- Export `./personalization.feature` resolves through `./src/personalization.feature.ts`.
- Export `./personalization.theme` resolves through `./src/personalization.theme.ts`.
- Export `./workflow-extension` resolves through `./src/workflow-extension.ts`.
- The package publishes 9 total export subpaths; keep docs aligned with `package.json`.

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
- Missing contract layers.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/lib.overlay-engine`, `@contractspec/lib.personalization`, `@contractspec/lib.workflow-composer`, ...
