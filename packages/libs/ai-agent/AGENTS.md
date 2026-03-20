# AI Agent Guide — `@contractspec/lib.ai-agent`

Scope: `packages/libs/ai-agent/*`

Core AI agent runtime for ContractSpec with tool orchestration, MCP integration, session state, memory, and telemetry.

## Quick Context

- Layer: `lib`.
- Package visibility: published package.
- Primary consumers are other libs, modules, bundles, and apps in the monorepo.
- Related packages: `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.surface-runtime`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

## Architecture

- `src/agent/`, `src/session/`, and `src/memory/` contain the runtime core for execution state and persistence hooks.
- `src/tools/`, `src.providers/`, and `src.interop/` connect providers, tools, and MCP-aware runtime surfaces.
- `src.telemetry/`, `src.approval/`, `src.knowledge/`, `src.schema/`, and `src.spec/` round out agent policy and observability surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Surface

- Large multi-subpath library exporting agent runtime, approval, memory, knowledge, providers, schema, telemetry, tools, and types.
- Export `.` resolves through `./src/index.ts`.
- Export `./agent` resolves through `./src/agent/index.ts`.
- Export `./agent/agent-factory` resolves through `./src/agent/agent-factory.ts`.
- Export `./agent/contract-spec-agent` resolves through `./src/agent/contract-spec-agent.ts`.
- Export `./agent/json-runner` resolves through `./src/agent/json-runner.ts`.
- Export `./agent/unified-agent` resolves through `./src/agent/unified-agent.ts`.
- Export `./approval` resolves through `./src/approval/index.ts`.
- Export `./approval/workflow` resolves through `./src/approval/workflow.ts`.
- Export `./exporters` resolves through `./src/exporters/index.ts`.
- Export `./exporters/claude-agent-exporter` resolves through `./src/exporters/claude-agent-exporter.ts`.
- The package publishes 66 total export subpaths; keep docs aligned with `package.json`.

## Guardrails

- `AgentSpec`-style runtime contracts are public API; preserve compatibility or document migrations explicitly.
- Keep provider and MCP adapters runtime-agnostic so browser, Bun, and Node consumers can share the core.
- Telemetry, approval, and memory hooks are deliberate control points; avoid bypassing them in new flows.
- Changes here can affect downstream packages such as `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.knowledge`, `@contractspec/lib.surface-runtime`, `@contractspec/tool.bun`, `@contractspec/tool.typescript`.

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
