# AI Agent Guide — `@contractspec/module.alpic`

Scope: `packages/modules/alpic/*`

Alpic MCP and ChatGPT App hosting helpers.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/assets` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/mcp/` contains MCP handlers, tools, prompts, and resources.

## Public Surface

- Export `.` resolves through `./src/index.ts`.

## Guardrails

- Depends on `@modelcontextprotocol/sdk` and `elysia` -- version bumps may break MCP protocol compatibility.
- Exposes external-facing endpoints; treat all inputs as untrusted.
- Changes affect MCP tool registration and ChatGPT plugin manifests.
- Changes here can affect downstream packages such as `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
