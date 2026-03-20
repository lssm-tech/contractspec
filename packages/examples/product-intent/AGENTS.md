# AI Agent Guide — `@contractspec/example.product-intent`

Scope: `packages/examples/product-intent/*`

Product intent example: evidence ingestion and prompt-ready outputs.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/integration.providers-impls`, `@contractspec/lib.ai-agent`, `@contractspec/lib.analytics`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.product-intent-utils`, ...

## Architecture

- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/load-evidence.test.ts` is part of the package's public or composition surface.
- `src/load-evidence.ts` is part of the package's public or composition surface.
- `src/posthog-signals.ts` is part of the package's public or composition surface.
- `src/product-intent.feature.ts` defines a feature entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/product-intent.docblock` resolves through `./src/docs/product-intent.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./load-evidence` resolves through `./src/load-evidence.ts`.
- Export `./posthog-signals` resolves through `./src/posthog-signals.ts`.
- Export `./product-intent.feature` resolves through `./src/product-intent.feature.ts`.
- Export `./script` resolves through `./src/script.ts`.
- Export `./sync-actions` resolves through `./src/sync-actions.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/integration.providers-impls`, `@contractspec/lib.ai-agent`, `@contractspec/lib.analytics`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.product-intent-utils`, ....
- Changes here can affect downstream packages such as `@contractspec/integration.providers-impls`, `@contractspec/lib.ai-agent`, `@contractspec/lib.analytics`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.product-intent-utils`, ...

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
