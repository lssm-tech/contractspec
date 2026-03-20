# AI Agent Guide — `@contractspec/example.policy-safe-knowledge-assistant`

Scope: `packages/examples/policy-safe-knowledge-assistant/*`

All-in-one template example: policy-safe knowledge assistant with locale/jurisdiction gating, versioned KB snapshots, HITL update pipeline, and learning hub.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/example.kb-update-pipeline`, `@contractspec/example.learning-patterns`, `@contractspec/example.locale-jurisdiction-gate`, `@contractspec/example.versioned-knowledge-base`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, ...

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/integration.test.ts` is part of the package's public or composition surface.
- `src/orchestrator` is part of the package's public or composition surface.
- `src/policy-safe-knowledge-assistant.feature.ts` defines a feature entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/policy-safe-knowledge-assistant.docblock` resolves through `./src/docs/policy-safe-knowledge-assistant.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./handlers` resolves through `./src/handlers/index.ts`.
- Export `./handlers/policy-safe-knowledge-assistant.handlers` resolves through `./src/handlers/policy-safe-knowledge-assistant.handlers.ts`.
- Export `./orchestrator/buildAnswer` resolves through `./src/orchestrator/buildAnswer.ts`.
- Export `./policy-safe-knowledge-assistant.feature` resolves through `./src/policy-safe-knowledge-assistant.feature.ts`.
- Export `./seed` resolves through `./src/seed/index.ts`.
- Export `./seed/fixtures` resolves through `./src/seed/fixtures.ts`.
- The package publishes 14 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/example.kb-update-pipeline`, `@contractspec/example.learning-patterns`, `@contractspec/example.locale-jurisdiction-gate`, `@contractspec/example.versioned-knowledge-base`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, ....
- Changes here can affect downstream packages such as `@contractspec/example.kb-update-pipeline`, `@contractspec/example.learning-patterns`, `@contractspec/example.locale-jurisdiction-gate`, `@contractspec/example.versioned-knowledge-base`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, ...

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
