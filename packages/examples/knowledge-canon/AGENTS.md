# AI Agent Guide — `@contractspec/example.knowledge-canon`

Scope: `packages/examples/knowledge-canon/*`

Knowledge example – Product Canon space (blueprint + tenant config + source sample + runtime helper).

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/agent.ts` is part of the package's public or composition surface.
- `src/blueprint.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/knowledge-canon.feature.ts` defines a feature entrypoint.
- `src/source.sample.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./agent` resolves through `./src/agent.ts`.
- Export `./blueprint` resolves through `./src/blueprint.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/knowledge-canon.docblock` resolves through `./src/docs/knowledge-canon.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./knowledge-canon.feature` resolves through `./src/knowledge-canon.feature.ts`.
- Export `./source.sample` resolves through `./src/source.sample.ts`.
- Export `./tenant` resolves through `./src/tenant.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
