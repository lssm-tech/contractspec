# @contractspec/example.marketplace

Website: https://contractspec.io

**Marketplace example with orders, payouts, and reviews for ContractSpec.**

## What This Demonstrates

- Multi-entity domain modeling (order, payout, product, review, store).
- Per-entity schema/enum/event/operations/presentation pattern.
- Capability and feature definition patterns.
- React UI with hooks, renderers, and dashboard component.
- Seeder pattern for demo data.
- Test-spec for operations validation.

## Running Locally

From `packages/examples/marketplace`:
- `bun run dev`
- `bun run build`
- `bun run typecheck`

## Usage

Use `@contractspec/example.marketplace` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/marketplace.capability.ts` defines a capability surface.
- `src/marketplace.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/marketplace.docblock` resolves through `./src/docs/marketplace.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./entities/order` resolves through `./src/entities/order.ts`.
- Export `./entities/payout` resolves through `./src/entities/payout.ts`.
- Export `./entities/product` resolves through `./src/entities/product.ts`.
- Export `./entities/review` resolves through `./src/entities/review.ts`.
- Export `./entities/store` resolves through `./src/entities/store.ts`.
- Export `./example` resolves through `./src/example.ts`.
- The package publishes 52 total export subpaths; keep docs aligned with `package.json`.

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

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, ...
