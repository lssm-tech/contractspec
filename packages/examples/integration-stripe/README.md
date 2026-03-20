# @contractspec/example.integration-stripe

Website: https://contractspec.io

**Integration example – Stripe Payments (blueprint + workflow + tenant config).**

## What This Demonstrates

- Integration blueprint definition for Stripe.
- Payment workflow with typed steps.
- Multi-tenant configuration pattern.
- Connection sample for credential wiring.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/integration-stripe`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.integration-stripe` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/blueprint.ts` is part of the package's public or composition surface.
- `src/connection.sample.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/integration-stripe.feature.ts` defines a feature entrypoint.
- `src/tenant.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./blueprint` resolves through `./src/blueprint.ts`.
- Export `./connection.sample` resolves through `./src/connection.sample.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/integration-stripe.docblock` resolves through `./src/docs/integration-stripe.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./integration-stripe.feature` resolves through `./src/integration-stripe.feature.ts`.
- Export `./tenant` resolves through `./src/tenant.ts`.
- Export `./workflow` resolves through `./src/workflow.ts`.

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

- Works alongside `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
