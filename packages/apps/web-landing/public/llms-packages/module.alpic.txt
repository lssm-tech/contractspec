# @contractspec/module.alpic

Website: https://contractspec.io

**Alpic MCP and ChatGPT App hosting helpers.**

## What It Provides

- **Layer**: module.
- **Consumers**: apps (alpic-mcp, chatgpt-app).
- `src/mcp/` contains MCP handlers, tools, prompts, and resources.
- Related ContractSpec packages include `@contractspec/lib.contracts-spec`, `@contractspec/lib.logger`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.
- `src/mcp/` contains MCP handlers, tools, prompts, and resources.

## Installation

`npm install @contractspec/module.alpic`

or

`bun add @contractspec/module.alpic`

## Usage

Import the root entrypoint from `@contractspec/module.alpic`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/assets` is part of the package's public or composition surface.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/mcp/` contains MCP handlers, tools, prompts, and resources.

## Public Entry Points

- Export `.` resolves through `./src/index.ts`.

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

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed.
- Standardize tool naming to underscore notation.
- Add changesets and apply pending fixes.
- Add first-class transport, auth, versioning, and BYOK support across all integrations.
- Test runner.

## Notes

- Depends on `@modelcontextprotocol/sdk` and `elysia` -- version bumps may break MCP protocol compatibility.
- Exposes external-facing endpoints; treat all inputs as untrusted.
- Changes affect MCP tool registration and ChatGPT plugin manifests.
