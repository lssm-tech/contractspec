# AI Agent Guide — `@contractspec/example.learning-patterns`

Scope: `packages/examples/learning-patterns/*`

Example: drills + ambient coach + quests learning patterns, powered by Learning Journey (event-driven, deterministic).

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/events.ts` is package-level event definitions.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-patterns.feature.ts` defines a feature entrypoint.
- `src/learning-patterns.test.ts` is part of the package's public or composition surface.
- `src/tracks` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-patterns.docblock` resolves through `./src/docs/learning-patterns.docblock.ts`.
- Export `./events` resolves through `./src/events.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./learning-patterns.feature` resolves through `./src/learning-patterns.feature.ts`.
- Export `./tracks` resolves through `./src/tracks/index.ts`.
- Export `./tracks/ambient-coach` resolves through `./src/tracks/ambient-coach.ts`.
- Export `./tracks/drills` resolves through `./src/tracks/drills.ts`.
- Export `./tracks/quests` resolves through `./src/tracks/quests.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/module.learning-journey`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
