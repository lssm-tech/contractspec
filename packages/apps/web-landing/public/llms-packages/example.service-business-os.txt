# @contractspec/example.service-business-os

Website: https://contractspec.io

**Service Business OS example (clients, quotes, jobs, invoices) for ContractSpec.**

## What This Demonstrates

- Multi-entity domain modeling (client, quote, job, invoice, payment).
- Per-entity schema and operations pattern.
- Capability and feature definition patterns.
- Presentation layer and event-driven architecture.
- Handler aggregation.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/service-business-os`:
- `bun run dev`
- `bun run build`
- `bun run typecheck`

## Usage

Use `@contractspec/example.service-business-os` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/client` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./client` resolves through `./src/client/index.ts`.
- Export `./client/client.operations` resolves through `./src/client/client.operations.ts`.
- Export `./client/client.schema` resolves through `./src/client/client.schema.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/service-business-os.docblock` resolves through `./src/docs/service-business-os.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- The package publishes 26 total export subpaths; keep docs aligned with `package.json`.

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

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
