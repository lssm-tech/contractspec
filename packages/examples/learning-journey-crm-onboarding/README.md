# @contractspec/example.learning-journey-crm-onboarding

Website: https://contractspec.io

**Learning journey track that onboards users to the CRM pipeline example.**

## What This Demonstrates

- CRM-specific onboarding track with step-by-step guidance.
- Feature definition with operations, presentations, and test-specs.
- Demo handlers for simulated onboarding flow.
- Cross-example dependency (builds on crm-pipeline).
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/examples/learning-journey-crm-onboarding`:
- `bun run dev`
- `bun run build`
- `bun run typecheck`

## Usage

Use `@contractspec/example.learning-journey-crm-onboarding` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-crm-onboarding.feature.ts` defines a feature entrypoint.
- `src/operations` is part of the package's public or composition surface.
- `src/presentations` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/crm-onboarding.docblock` resolves through `./src/docs/crm-onboarding.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers/demo.handlers` resolves through `./src/handlers/demo.handlers.ts`.
- Export `./learning-journey-crm-onboarding.feature` resolves through `./src/learning-journey-crm-onboarding.feature.ts`.
- Export `./operations` resolves through `./src/operations/index.ts`.
- Export `./presentations` resolves through `./src/presentations/index.ts`.
- Export `./tests/operations.test-spec` resolves through `./src/tests/operations.test-spec.ts`.
- Export `./track` resolves through `./src/track.ts`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Missing contract layers.

## Notes

- Works alongside `@contractspec/example.crm-pipeline`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, ...
