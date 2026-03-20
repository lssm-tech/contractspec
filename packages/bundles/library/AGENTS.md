# AI Agent Guide — `@contractspec/bundle.library`

Scope: `packages/bundles/library/*`

Shared library bundle that composes docs, templates, integrations, MCP implementations, and reusable presentation surfaces.

## Quick Context

- Layer: `bundle`.
- Package visibility: published package.
- Primary consumers are apps and higher-level composed product surfaces.
- Related packages: `@contractspec/lib.ai-providers`, `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-library`, `@contractspec/lib.contracts-runtime-server-graphql`, `@contractspec/lib.contracts-runtime-server-mcp`, ...

## Architecture

- `src/application/` contains application services including MCP implementations and cross-surface orchestration.
- `src/components/` contains reusable docs, integrations, legal, shell, and template presentation code.
- `src/features/`, `src.config/`, `src.infrastructure/`, and `src.libs/` hold bundle-local composition helpers.
- `src/presentation/` contains feature-specific UI composition exported to consuming apps.
- `src/index.ts` is the root public barrel and package entrypoint.

## Public Surface

- Large multi-subpath bundle exporting docs, integrations, templates, shell layout, email helpers, and MCP application surfaces.
- Export `.` resolves through `./src/index.ts`.
- Export `./application` resolves through `./src/application/index.ts`.
- Export `./application/context-storage` resolves through `./src/application/context-storage/index.ts`.
- Export `./application/mcp` resolves through `./src/application/mcp/index.ts`.
- Export `./application/mcp/cliMcp` resolves through `./src/application/mcp/cliMcp.ts`.
- Export `./application/mcp/common` resolves through `./src/application/mcp/common.ts`.
- Export `./application/mcp/contractsMcp` resolves through `./src/application/mcp/contractsMcp.ts`.
- Export `./application/mcp/contractsMcpResources` resolves through `./src/application/mcp/contractsMcpResources.ts`.
- Export `./application/mcp/contractsMcpTools` resolves through `./src/application/mcp/contractsMcpTools.ts`.
- Export `./application/mcp/contractsMcpTypes` resolves through `./src/application/mcp/contractsMcpTypes.ts`.
- The package publishes 297 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- This bundle has wide blast radius across web and API apps; export changes cascade quickly.
- Keep transport details in app shells; MCP services here should remain transport-agnostic.
- Avoid import-time side effects because many consumers only need narrow subpath exports.
- Changes here can affect downstream packages such as `@contractspec/lib.ai-providers`, `@contractspec/lib.content-gen`, `@contractspec/lib.contracts-integrations`, `@contractspec/lib.contracts-library`, `@contractspec/lib.contracts-runtime-server-graphql`, `@contractspec/lib.contracts-runtime-server-mcp`, ...

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run lint` — bun run lint:fix
- `bun run lint:check` — biome check .
- `bun run lint:fix` — biome check --write --unsafe --only=nursery/useSortedClasses . && biome check --write .
- `bun run typecheck` — tsc --noEmit
- `bun run publish:pkg` — bun publish --tolerate-republish --ignore-scripts --verbose
- `bun run publish:pkg:canary` — bun publish:pkg --tag canary
- `bun run clean` — rm -rf dist
- `bun run build:bundle` — contractspec-bun-build transpile
- `bun run build:types` — contractspec-bun-build types
- `bun run prebuild` — contractspec-bun-build prebuild
