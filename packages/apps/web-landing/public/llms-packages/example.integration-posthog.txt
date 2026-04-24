# @contractspec/example.integration-posthog

Website: https://contractspec.io

**PostHog analytics integration example: capture events, run HogQL, and manage feature flags.**

## What This Demonstrates

- PostHog event capture and tracking setup.
- HogQL query execution pattern.
- Feature flag management via PostHog API.
- Integration provider pattern with ContractSpec contracts.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/docs/` contains docblocks and documentation-facing exports.

## Running Locally

From `packages/examples/integration-posthog`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.integration-posthog` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/integration-posthog.feature.ts` defines a feature entrypoint.
- `src/posthog.ts` is part of the package's public or composition surface.
- `src/run.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/integration-posthog.docblock` resolves through `./src/docs/integration-posthog.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./integration-posthog.feature` resolves through `./src/integration-posthog.feature.ts`.
- Export `./posthog` resolves through `./src/posthog.ts`.
- Export `./run` resolves through `./src/run.ts`.

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
- Add changesets and apply pending fixes.
- Missing contract layers.

## Notes

- Works alongside `@contractspec/integration.provider.analytics`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
