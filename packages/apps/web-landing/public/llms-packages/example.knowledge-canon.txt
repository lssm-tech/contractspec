# @contractspec/example.knowledge-canon

Website: https://contractspec.io

**Knowledge example – Product Canon space (blueprint + tenant config + source sample + real `lib.knowledge` retrieval helper).**

## What This Demonstrates

- Canonical `knowledge-space` export via `ProductCanonKnowledgeSpace`.
- Lightweight `app-config` example via `defineAppConfig(...)`.
- Multi-tenant configuration for knowledge bases.
- Source sample for content ingestion.
- Agent helper backed by `@contractspec/lib.knowledge` static retrieval.
- Minimal contract-only example pattern.
- `src/docs/` contains docblocks and documentation-facing exports.
- The same runtime primitives can ingest Gmail and Google Drive sources through `KnowledgeRuntime` when a workspace wires provider implementations.

## Running Locally

From `packages/examples/knowledge-canon`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run typecheck`

## Usage

Use `@contractspec/example.knowledge-canon` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

The public `answerWithKnowledge(...)` helper now performs a real retrieval step through `@contractspec/lib.knowledge`, so the example is suitable as a copy-pasteable lightweight knowledge-routing pattern.

For provider-backed workspaces, compose the same package with `createKnowledgeRuntime({ gmail, drive, ... })` and call `syncGmail(...)` or `syncDriveFiles(...)` before retrieval. Mutating external knowledge systems should use the governance helpers from `@contractspec/lib.knowledge/governance` so dry-runs, approval refs, idempotency keys, audit evidence, and outbound-send gates are captured consistently.

## Architecture

- `src/agent.ts` is part of the package's public or composition surface.
- `src/blueprint.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the package example manifest/metadata entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/knowledge-canon.feature.ts` defines a feature entrypoint.
- `src/product-canon.space.ts` defines the exported knowledge-space spec.
- `src/source.sample.ts` is part of the package's public or composition surface.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.
- Export `./agent` resolves through `./src/agent.ts`.
- Export `./blueprint` resolves through `./src/blueprint.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/knowledge-canon.docblock` resolves through `./src/docs/knowledge-canon.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./knowledge-canon.feature` resolves through `./src/knowledge-canon.feature.ts`.
- Export `./product-canon.space` resolves through `./src/product-canon.space.ts`.
- Export `./source.sample` resolves through `./src/source.sample.ts`.
- Export `./tenant` resolves through `./src/tenant.ts`.
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

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
