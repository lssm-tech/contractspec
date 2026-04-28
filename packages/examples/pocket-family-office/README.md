# @contractspec/example.pocket-family-office

Website: https://contractspec.io

**Pocket Family Office example - personal finance automation with open banking.**

## What This Demonstrates

- Workflow-driven open banking integration (sync accounts, transactions, balances).
- Financial summary and overview generation workflows.
- Document processing and email thread ingestion.
- Capability and feature definition patterns.
- Canonical `telemetry` export via `pocketFamilyOfficeTelemetry`.
- Sample tenant and connection configuration.
- An inline `PocketFamilyOfficePreview` UI for template and example browsers.

## Running Locally

From `packages/examples/pocket-family-office`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.pocket-family-office` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/blueprint.ts` is part of the package's public or composition surface.
- `src/connections` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/knowledge` is part of the package's public or composition surface.
- `src/operations` is part of the package's public or composition surface.
- `src/telemetry.ts` defines the exported telemetry spec.
- `src/ui/` contains the inline preview surface for catalog and template browsers.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./blueprint` resolves through `./src/blueprint.ts`.
- Export `./connections/samples` resolves through `./src/connections/samples.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/pocket-family-office.docblock` resolves through `./src/docs/pocket-family-office.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./knowledge/sources.sample` resolves through `./src/knowledge/sources.sample.ts`.
- Export `./operations` resolves through `./src/operations/index.ts`.
- Export `./pocket-family-office.capability` resolves through `./src/pocket-family-office.capability.ts`.
- Export `./pocket-family-office.feature` resolves through `./src/pocket-family-office.feature.ts`.
- Export `./telemetry` resolves through `./src/telemetry.ts`.
- Export `./tenant.sample` resolves through `./src/tenant.sample.ts`.
- Export `./ui` resolves through `./src/ui/index.ts`.
- Export `./ui/PocketFamilyOfficePreview` resolves through `./src/ui/PocketFamilyOfficePreview.tsx`.
- Export `./ui/pocket-family-office-preview.data` resolves through `./src/ui/pocket-family-office-preview.data.ts`.
- Export `./workflows` resolves through `./src/workflows/index.ts`.
- The package publishes 24 total export subpaths; keep docs aligned with `package.json`.

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
- `bun run clean` — bun rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Missing contract layers.
- Resolve lint/test regressions after voice capability updates.
- Major change to content generation.

## Notes

- Works alongside `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, ...
