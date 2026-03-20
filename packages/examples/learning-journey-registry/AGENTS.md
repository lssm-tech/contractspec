# AI Agent Guide — `@contractspec/example.learning-journey-registry`

Scope: `packages/examples/learning-journey-registry/*`

Registry that aggregates learning journey example tracks.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/example.learning-journey-ambient-coach`, `@contractspec/example.learning-journey-crm-onboarding`, `@contractspec/example.learning-journey-duo-drills`, `@contractspec/example.learning-journey-platform-tour`, `@contractspec/example.learning-journey-quest-challenges`, `@contractspec/example.learning-journey-studio-onboarding`, ...

## Architecture

- `src/api-types.ts` is part of the package's public or composition surface.
- `src/api.test.ts` is part of the package's public or composition surface.
- `src/api.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/learning-journey-registry.feature.ts` defines a feature entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./api` resolves through `./src/api.ts`.
- Export `./api-types` resolves through `./src/api-types.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/learning-journey-registry.docblock` resolves through `./src/docs/learning-journey-registry.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./learning-journey-registry.feature` resolves through `./src/learning-journey-registry.feature.ts`.
- Export `./presentations` resolves through `./src/presentations/index.ts`.
- Export `./progress-store` resolves through `./src/progress-store.ts`.
- Export `./tracks` resolves through `./src/tracks.ts`.
- The package publishes 12 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/example.learning-journey-ambient-coach`, `@contractspec/example.learning-journey-crm-onboarding`, `@contractspec/example.learning-journey-duo-drills`, `@contractspec/example.learning-journey-platform-tour`, `@contractspec/example.learning-journey-quest-challenges`, `@contractspec/example.learning-journey-studio-onboarding`, ....
- Changes here can affect downstream packages such as `@contractspec/example.learning-journey-ambient-coach`, `@contractspec/example.learning-journey-crm-onboarding`, `@contractspec/example.learning-journey-duo-drills`, `@contractspec/example.learning-journey-platform-tour`, `@contractspec/example.learning-journey-quest-challenges`, `@contractspec/example.learning-journey-studio-onboarding`, ...

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
