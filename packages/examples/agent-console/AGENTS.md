# AI Agent Guide — `@contractspec/example.agent-console`

Scope: `packages/examples/agent-console/*`

Agent Console example - AI agent orchestration with tools, runs, and logs.

## Quick Context

- Layer: `example`.
- Package visibility: published package.
- Primary consumers are example explorers, template authors, and documentation readers.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, ...

## Architecture

- `src/agent` is part of the package's public or composition surface.
- `src/agent.capability.ts` defines a capability surface.
- `src/agent.feature.ts` defines a feature entrypoint.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Export `.` resolves through `./src/index.ts`.
- Export `./agent` resolves through `./src/agent/index.ts`.
- Export `./agent.capability` resolves through `./src/agent.capability.ts`.
- Export `./agent.feature` resolves through `./src/agent.feature.ts`.
- Export `./agent/agent.entity` resolves through `./src/agent/agent.entity.ts`.
- Export `./agent/agent.enum` resolves through `./src/agent/agent.enum.ts`.
- Export `./agent/agent.event` resolves through `./src/agent/agent.event.ts`.
- Export `./agent/agent.handler` resolves through `./src/agent/agent.handler.ts`.
- Export `./agent/agent.operation` resolves through `./src/agent/agent.operation.ts`.
- Export `./agent/agent.presentation` resolves through `./src/agent/agent.presentation.ts`.
- The package publishes 66 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- Keep the example package demonstrative, buildable, and aligned with the exported feature surface.
- Do not add hidden production assumptions that are not actually implemented in the example.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, ....
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, `@contractspec/tool.bun`, ...

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
