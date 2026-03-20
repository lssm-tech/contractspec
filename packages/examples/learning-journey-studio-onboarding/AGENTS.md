# AI Agent Guide — `@contractspec/example.learning-journey-studio-onboarding`

Scope: `packages/examples/learning-journey-studio-onboarding/*`

Learning journey track for first 30 minutes in ContractSpec Studio.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-studio-onboarding.feature.ts` defines a feature entrypoint.
- `src/operations` is part of the package's public or composition surface.
- `src/presentations` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/studio-onboarding.docblock` resolves through `./src/docs/studio-onboarding.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers/demo.handlers` resolves through `./src/handlers/demo.handlers.ts`.
- Export `./learning-journey-studio-onboarding.feature` resolves through `./src/learning-journey-studio-onboarding.feature.ts`.
- Export `./operations` resolves through `./src/operations/index.ts`.
- Export `./presentations` resolves through `./src/presentations/index.ts`.
- Export `./tests/operations.test-spec` resolves through `./src/tests/operations.test-spec.ts`.
- Export `./track` resolves through `./src/track.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.schema`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
