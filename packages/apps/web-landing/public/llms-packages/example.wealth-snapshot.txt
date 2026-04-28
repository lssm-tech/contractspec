# @contractspec/example.wealth-snapshot

Website: https://contractspec.io

**Wealth Snapshot mini-app for accounts, assets, liabilities, and goals.**

## What This Demonstrates

- Financial entity modeling (accounts, assets, liabilities, goals).
- Capability and feature definition patterns.
- Presentation layer and event-driven architecture.
- RBAC, audit trail, and notification module integration.
- An inline `WealthSnapshotPreview` UI for template and example browsers.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/examples/wealth-snapshot`:
- `bun run dev`
- `bun run build`
- `bun run typecheck`

## Usage

Use `@contractspec/example.wealth-snapshot` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/events.ts` is package-level event definitions.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/operations` is part of the package's public or composition surface.
- `src/ui/` contains the inline preview surface for catalog and template browsers.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/wealth-snapshot.docblock` resolves through `./src/docs/wealth-snapshot.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- Export `./operations` resolves through `./src/operations/index.ts`.
- Export `./presentations` resolves through `./src/presentations.ts`.
- Export `./ui` resolves through `./src/ui/index.ts`.
- Export `./ui/WealthSnapshotPreview` resolves through `./src/ui/WealthSnapshotPreview.tsx`.
- Export `./ui/wealth-snapshot-preview.data` resolves through `./src/ui/wealth-snapshot-preview.data.ts`.
- Export `./wealth-snapshot.capability` resolves through `./src/wealth-snapshot.capability.ts`.
- Export `./wealth-snapshot.feature` resolves through `./src/wealth-snapshot.feature.ts`.
- The package publishes 14 total export subpaths; keep docs aligned with `package.json`.

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

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.identity-rbac`, `@contractspec/lib.schema`, `@contractspec/module.audit-trail`, `@contractspec/module.notifications`, ...
