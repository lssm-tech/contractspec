# AI Agent Guide — `@contractspec/example.lifecycle-cli`

Scope: `packages/examples/lifecycle-cli/*`

Lifecycle CLI demo (example): run lifecycle assessment without an HTTP server.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/bundle.lifecycle-managed`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/demo.ts` is part of the package's public or composition surface.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/lifecycle-cli.feature.ts` defines a feature entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./demo` resolves through `./src/demo.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/lifecycle-cli.docblock` resolves through `./src/docs/lifecycle-cli.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./lifecycle-cli.feature` resolves through `./src/lifecycle-cli.feature.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/bundle.lifecycle-managed`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/bundle.lifecycle-managed`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.lifecycle`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
