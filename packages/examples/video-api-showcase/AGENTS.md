# AI Agent Guide — `@contractspec/example.video-api-showcase`

Scope: `packages/examples/video-api-showcase/*`

Generate API documentation videos from contract spec definitions using the ApiOverview composition.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.video-gen`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/build-api-video.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/sample-specs.ts` is part of the package's public or composition surface.
- `src/video-api-showcase.feature.ts` defines a feature entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./build-api-video` resolves through `./src/build-api-video.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/video-api-showcase.docblock` resolves through `./src/docs/video-api-showcase.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./sample-specs` resolves through `./src/sample-specs.ts`.
- Export `./video-api-showcase.feature` resolves through `./src/video-api-showcase.feature.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.video-gen`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.video-gen`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
