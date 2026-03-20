# AI Agent Guide — `@contractspec/example.crm-pipeline`

Scope: `packages/examples/crm-pipeline/*`

CRM Pipeline - Contacts, Companies, Deals, Tasks.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.identity-rbac`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, ...

## Architecture

- `src/crm-pipeline.feature.ts` defines a feature entrypoint.
- `src/deal` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/entities/` contains domain entities and value objects.
- `src/events` is part of the package's public or composition surface.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./crm-pipeline.feature` resolves through `./src/crm-pipeline.feature.ts`.
- Export `./deal` resolves through `./src/deal/index.ts`.
- Export `./deal/deal.enum` resolves through `./src/deal/deal.enum.ts`.
- Export `./deal/deal.operation` resolves through `./src/deal/deal.operation.ts`.
- Export `./deal/deal.schema` resolves through `./src/deal/deal.schema.ts`.
- Export `./deal/deal.test-spec` resolves through `./src/deal/deal.test-spec.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/crm-pipeline.docblock` resolves through `./src/docs/crm-pipeline.docblock.ts`.
- Export `./entities` resolves through `./src/entities/index.ts`.
- The package publishes 44 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.identity-rbac`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, ....
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.identity-rbac`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, ...

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test --pass-with-no-tests
- `bun run lint` — bun lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run validate` — contractspec validate "src/**/*"
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rimraf dist .turbo
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
