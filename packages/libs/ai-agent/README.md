# @contractspec/lib.ai-agent

Website: https://contractspec.io

**Core AI agent runtime for ContractSpec with tool orchestration, MCP integration, session state, memory, and telemetry.**

## What It Provides

- Provides the central agent runtime used by chat, automation, and higher-level orchestration packages.
- Supports tools, sessions, memory, approvals, providers, telemetry, and MCP-aware workflows.
- Acts as the stable public API for agent execution across multiple runtimes and delivery surfaces.
- `src/providers/` contains provider integrations and provider-facing adapters.

## Installation

`npm install @contractspec/lib.ai-agent`

or

`bun add @contractspec/lib.ai-agent`

## Usage

Import the root entrypoint from `@contractspec/lib.ai-agent`, or choose a documented subpath when you only need one part of the package surface.

## Architecture

- `src/agent/`, `src/session/`, and `src/memory/` contain the runtime core for execution state and persistence hooks.
- `src/tools/`, `src.providers/`, and `src.interop/` connect providers, tools, and MCP-aware runtime surfaces.
- `src.telemetry/`, `src.approval/`, `src.knowledge/`, `src.schema/`, and `src.spec/` round out agent policy and observability surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/types.ts` is shared public type definitions.

## Public Entry Points

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

## Recent Updates

- Missing dependencies (thanks to knip).
- Replace eslint+prettier by biomejs to optimize speed.
- Agentic workflows — subagents, memory tools, and next steps.
- Vnext ai-native.
- Backend operations + frontend rendering support.
- Add latest models and align defaults.

## Notes

- High blast radius — used by multiple bundles and libs.
- `AgentSpec` interface is a public contract; do not change its shape without a migration plan.
- MCP transport adapters must stay runtime-agnostic (no Node/browser-specific globals).
