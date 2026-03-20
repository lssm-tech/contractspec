# AI Agent Guide — `@contractspec/example.ai-support-bot`

Scope: `packages/examples/ai-support-bot/*`

AI support bot example: classify and resolve a support ticket using @contractspec/lib.support-bot.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.logger`, `@contractspec/lib.support-bot`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/ai-support-bot.feature.ts` defines a feature entrypoint.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/setup.ts` is part of the package's public or composition surface.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./ai-support-bot.feature` resolves through `./src/ai-support-bot.feature.ts`.
- Export `./docs` resolves through `./src/docs/index.ts`.
- Export `./docs/ai-support-bot.docblock` resolves through `./src/docs/ai-support-bot.docblock.ts`.
- Export `./example` resolves through `./src/example.ts`.
- Export `./setup` resolves through `./src/setup.ts`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.logger`, `@contractspec/lib.support-bot`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.logger`, `@contractspec/lib.support-bot`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
