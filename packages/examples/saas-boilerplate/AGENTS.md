# AI Agent Guide — `@contractspec/example.saas-boilerplate`

Scope: `packages/examples/saas-boilerplate/*`

SaaS Boilerplate - Users, Orgs, Projects, Billing, Settings.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.identity-rbac`, `@contractspec/lib.jobs`, `@contractspec/lib.runtime-sandbox`, ...

## Architecture

- `src/billing` is part of the package's public or composition surface.
- `src/dashboard` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/presentations` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./billing` resolves through `./src/billing/index.ts`.
- Export `./billing/billing.entity` resolves through `./src/billing/billing.entity.ts`.
- Export `./billing/billing.enum` resolves through `./src/billing/billing.enum.ts`.
- Export `./billing/billing.event` resolves through `./src/billing/billing.event.ts`.
- Export `./billing/billing.handler` resolves through `./src/billing/billing.handler.ts`.
- Export `./billing/billing.operations` resolves through `./src/billing/billing.operations.ts`.
- Export `./billing/billing.presentation` resolves through `./src/billing/billing.presentation.ts`.
- Export `./billing/billing.schema` resolves through `./src/billing/billing.schema.ts`.
- Export `./dashboard` resolves through `./src/dashboard/index.ts`.
- The package publishes 48 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.identity-rbac`, `@contractspec/lib.jobs`, `@contractspec/lib.runtime-sandbox`, ....
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.identity-rbac`, `@contractspec/lib.jobs`, `@contractspec/lib.runtime-sandbox`, ...

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
