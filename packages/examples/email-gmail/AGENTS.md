# AI Agent Guide — `@contractspec/example.email-gmail`

Scope: `packages/examples/email-gmail/*`

Gmail integration example: inbound threads and outbound messages.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/integration.providers-impls`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/auth.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/email-gmail.feature.ts` defines a feature entrypoint.
- `src/example.ts` is the runnable example entrypoint.
- `src/inbound.ts` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/outbound.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./auth` resolves through `./src/auth.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/email-gmail.docblock` resolves through `./src/docs/email-gmail.docblock.ts`.
- Export `./email-gmail.feature` resolves through `./src/email-gmail.feature.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./inbound` resolves through `./src/inbound.ts`.
- Export `./outbound` resolves through `./src/outbound.ts`.
- Export `./run` resolves through `./src/run.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/integration.providers-impls`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/integration.providers-impls`, `@contractspec/lib.contracts-spec`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
