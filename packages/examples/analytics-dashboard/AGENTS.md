# AI Agent Guide — `@contractspec/example.analytics-dashboard`

Scope: `packages/examples/analytics-dashboard/*`

Analytics Dashboard example with widgets and query engine for ContractSpec.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, ...

## Architecture

- `src/dashboard` is part of the package's public or composition surface.
- `src/dashboard.feature.ts` defines a feature entrypoint.
- `src/datasource` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/events.ts` is package-level event definitions.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./dashboard` resolves through `./src/dashboard/index.ts`.
- Export `./dashboard.feature` resolves through `./src/dashboard.feature.ts`.
- Export `./dashboard/dashboard.enum` resolves through `./src/dashboard/dashboard.enum.ts`.
- Export `./dashboard/dashboard.operation` resolves through `./src/dashboard/dashboard.operation.ts`.
- Export `./dashboard/dashboard.presentation` resolves through `./src/dashboard/dashboard.presentation.ts`.
- Export `./dashboard/dashboard.schema` resolves through `./src/dashboard/dashboard.schema.ts`.
- Export `./dashboard/dashboard.test-spec` resolves through `./src/dashboard/dashboard.test-spec.ts`.
- Export `./datasource/posthog-datasource` resolves through `./src/datasource/posthog-datasource.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- The package publishes 37 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, ....
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, ...

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
