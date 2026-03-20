# @contractspec/example.agent-console

Website: https://contractspec.io

**Agent Console example - AI agent orchestration with tools, runs, and logs.**

## What This Demonstrates

- Agent entity with lifecycle (create, configure, execute).
- Canonical `agent`, `harness-scenario`, and `harness-suite` example exports for deterministic proof coverage.
- Run tracking with status enums and event-driven state transitions.
- Tool registry with typed schemas and operation handlers.
- Presentation layer with React UI components, hooks, modals, overlays, and a server-mode shared `DataTable` for run history.
- Shared table capabilities including sorting, pagination, column visibility toggles, and expandable run diagnostics.
- Contract-backed visualization surfaces for run status, activity, and duration-vs-token analysis.
- One deterministic demo runtime shared across React hooks, markdown renderers, and the sandbox runtime.
- Markdown and React renderers for multi-surface output.
- Seeded local data and harness replay proof for offline-safe demo scenarios.

## Canonical Demo Path

- Default sandbox route: `/sandbox`
- Explicit sandbox route: `/sandbox?template=agent-console`
- Proof artifact: `packages/examples/agent-console/proofs/agent-console-meetup.replay.json`

The canonical walkthrough is deterministic and local-first:
1. Load the agent-console sandbox.
2. Inspect seeded agents, tools, runs, and metrics.
3. Create an agent.
4. Activate or pause it.
5. Execute a run.
6. Confirm the run and metrics update.
7. Export or inspect the generated replay proof.

## Runtime Boundaries

- React hooks and the sandbox use `createAgentConsoleDemoHandlers(...)` for the meetup path.
- Markdown renderers prefer runtime-fetched data and fall back to the same deterministic demo handlers.
- The demo runtime is intentionally mocked and offline-safe by default.
- Database-backed `createAgentHandlers(db)` remains available for non-demo runtime wiring.

## Running Locally

From `packages/examples/agent-console`:
- `bun run dev`
- `bun run build`
- `bun run test`
- `bun run proof`
- `bun run typecheck`
- `bun run preflight`

From the repository root:
- `bun run meetup:agent-console:policy`
- `bun run meetup:agent-console:proof`
- `bun run meetup:agent-console:preflight`

## Usage

Use `@contractspec/example.agent-console` as a reference implementation, or import its exported surfaces into a workspace that composes ContractSpec examples and bundles.

## Architecture

- `src/agent` is part of the package's public or composition surface.
- `src/agent.capability.ts` defines a capability surface.
- `src/agent.feature.ts` defines a feature entrypoint.
- `src/docs/` contains docblocks and documentation-facing exports.
- `src/example.ts` is the runnable example entrypoint.
- `src/handlers/` contains handlers or demo adapters wired to contract surfaces.
- `src/index.ts` is the root public barrel and package entrypoint.
- `src/proof/` contains the exported meetup proof scenario and suite.

## Public Entry Points

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
- Export `./proof` resolves through `./src/proof/index.ts`.
- Export `./proof/meetup-proof.scenario` resolves through `./src/proof/meetup-proof.scenario.ts`.
- Export `./proof/meetup-proof.suite` resolves through `./src/proof/meetup-proof.suite.ts`.
- The package publishes 72 total export subpaths; keep docs aligned with `package.json`.

## Local Commands

- `bun run dev` — contractspec-bun-build dev
- `bun run build` — bun run prebuild && bun run build:bundle && bun run build:types
- `bun run test` — bun test
- `bun run proof` — bun ../../../scripts/generate-agent-console-meetup-proof.ts
- `bun run preflight` — bun run build && bun run typecheck && bun run test && bun ../../../scripts/check-agent-console-meetup-policy.ts && bun run proof
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

- Unified the meetup demo around a single seeded runtime.
- Added focused handler tests, a sandbox smoke test, and a harness replay proof.
- Added a slice-scoped meetup preflight instead of relying on the repo-wide policy backlog.

## Notes

- Works alongside `@contractspec/lib.contracts-spec`, `@contractspec/lib.design-system`, `@contractspec/lib.example-shared-ui`, `@contractspec/lib.runtime-sandbox`, `@contractspec/lib.schema`, ...
