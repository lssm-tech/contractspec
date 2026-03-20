# @contractspec/example.openbanking-powens

Website: https://contractspec.io

**OpenBanking Powens example: OAuth callback + webhook handler patterns (provider + workflows).**

## What This Demonstrates

- OAuth callback handler pattern for open banking.
- Webhook handler for asynchronous bank event ingestion.
- Canonical `job` export via `PowensSyncDispatchJob`.
- Provider integration via contracts-integrations.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Running Locally

From `packages/examples/openbanking-powens`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.openbanking-powens` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/jobs/` contains the exported Powens dispatch job spec.
- `src/openbanking-powens.feature.ts` defines a feature entrypoint.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/openbanking-powens.docblock` resolves through `./src/docs/openbanking-powens.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers/oauth-callback` resolves through `./src/handlers/oauth-callback.ts`.
- Export `./handlers/webhook-handler` resolves through `./src/handlers/webhook-handler.ts`.
- Export `./jobs` resolves through `./src/jobs/index.ts`.
- Export `./jobs/powens-sync-dispatch.job` resolves through `./src/jobs/powens-sync-dispatch.job.ts`.
- Export `./openbanking-powens.feature` resolves through `./src/openbanking-powens.feature.ts`.
- The package publishes 8 total export subpaths; keep docs aligned with `package.json`.

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

- Works alongside `@contractspec/integration.providers-impls`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
