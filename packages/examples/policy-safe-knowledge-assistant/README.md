# @contractspec/example.policy-safe-knowledge-assistant

Website: https://contractspec.io

**All-in-one template example: policy-safe knowledge assistant with locale/jurisdiction gating, versioned KB snapshots, HITL update pipeline, and learning hub.**

## What This Demonstrates

- Composition of multiple example packages into a full-stack assistant.
- Orchestrator pattern (`buildAnswer`) for policy-gated responses.
- React dashboard with hooks and UI components.
- Seed data and fixture patterns.
- Feature definition aggregating sub-features.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/policy-safe-knowledge-assistant`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.policy-safe-knowledge-assistant` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/integration.test.ts` is part of the package's public or composition surface.
- `src/orchestrator` is part of the package's public or composition surface.
- `src/policy-safe-knowledge-assistant.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/policy-safe-knowledge-assistant.docblock` resolves through `./src/docs/policy-safe-knowledge-assistant.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- Export `./handlers/policy-safe-knowledge-assistant.handlers` resolves through `./src/handlers/policy-safe-knowledge-assistant.handlers.ts`.
- Export `./orchestrator/buildAnswer` resolves through `./src/orchestrator/buildAnswer.ts`.
- Export `./policy-safe-knowledge-assistant.feature` resolves through `./src/policy-safe-knowledge-assistant.feature.ts`.
- Export `./seed` resolves through `./src/seed/index.ts`.
- Export `./seed/fixtures` resolves through `./src/seed/fixtures.ts`.
- The package publishes 14 total export subpaths; keep docs aligned with `package.json`.

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
- Missing contract layers.

## Notes

- Works alongside `@contractspec/example.kb-update-pipeline`, `@contractspec/example.learning-patterns`, `@contractspec/example.locale-jurisdiction-gate`, `@contractspec/example.versioned-knowledge-base`, `@contractspec/lib.contracts-spec`, ...
