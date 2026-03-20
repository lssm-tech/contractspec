# AI Agent Guide — `@contractspec/module.ai-chat`

Scope: `packages/modules/ai-chat/*`

AI chat module with context, core runtime, presentation components, hooks, providers, and agent-aware workflows.

## Quick Context

- Layer: `module`.
- Package visibility: published package.
- Primary consumers are bundles and apps that compose domain-specific features.
- Related packages: `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.cost-tracking`, `@contractspec/lib.design-system`, `@contractspec/lib.metering`, ...

## Architecture

- `src/context/` contains shared chat providers and contextual runtime state.
- `src/core/` contains chat orchestration, workflows, and non-UI runtime logic.
- `src/presentation/` exports UI components and React hooks for embedding the chat experience.
- `src/providers/` exposes provider bindings and provider-facing integration helpers.
- Top-level feature, capability, operation, schema, and event files define the module contract surface.
- `src/ai-chat.capability.ts` defines a capability surface.

## Public Surface

- Exports the root module plus context, core, presentation, presentation/components, presentation/hooks, and providers subpaths.
- Export `.` resolves through `./src/index.ts`.
- Export `./context` resolves through `./src/context/index.ts`.
- Export `./core` resolves through `./src/core/index.ts`.
- Export `./presentation` resolves through `./src/presentation/index.ts`.
- Export `./presentation/components` resolves through `./src/presentation/components/index.ts`.
- Export `./presentation/hooks` resolves through `./src/presentation/hooks/index.ts`.
- Export `./providers` resolves through `./src/providers/index.ts`.

## Guardrails

- Keep reusable chat runtime behavior in the module and underlying libs rather than app shells.
- Presentation, form, and data-view integration points are host contracts; preserve them when evolving tool rendering.
- MCP and agent-mode flows should stay aligned with `@contractspec/lib.ai-agent` and `@contractspec/lib.surface-runtime`.
- Changes here can affect downstream packages such as `@contractspec/lib.ai-agent`, `@contractspec/lib.ai-providers`, `@contractspec/lib.contracts-spec`, `@contractspec/lib.cost-tracking`, `@contractspec/lib.design-system`, `@contractspec/lib.metering`, ...

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
