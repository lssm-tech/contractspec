# AI Agent Guide — `@contractspec/example.personalization`

Scope: `packages/examples/personalization/*`

Personalization examples: behavior tracking, overlay customization, workflow extension.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/lib.overlay-engine`, `@contractspec/lib.personalization`, `@contractspec/lib.workflow-composer`, `@contractspec/tool.bun`, ...

## Architecture

- `src/behavior-tracking.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/overlay-customization.ts` is part of the package's public or composition surface.
- `src/personalization.feature.ts` defines a feature entrypoint.
- `src/workflow-extension.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./behavior-tracking` resolves through `./src/behavior-tracking.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/personalization.docblock` resolves through `./src/docs/personalization.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./overlay-customization` resolves through `./src/overlay-customization.ts`.
- Export `./personalization.feature` resolves through `./src/personalization.feature.ts`.
- Export `./workflow-extension` resolves through `./src/workflow-extension.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/lib.overlay-engine`, `@contractspec/lib.personalization`, `@contractspec/lib.workflow-composer`, `@contractspec/tool.bun`, ....
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/lib.overlay-engine`, `@contractspec/lib.personalization`, `@contractspec/lib.workflow-composer`, `@contractspec/tool.bun`, ...

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
