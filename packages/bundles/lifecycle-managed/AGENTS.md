# AI Agent Guide -- `@contractspec/bundle.lifecycle-managed`

Scope: `packages/bundles/lifecycle-managed/*`

Composes lifecycle-core and lifecycle-advisor modules with analytics and observability into a managed lifecycle bundle with assessment services, events, and an AI advisor agent.

## Quick Context

- **Layer**: bundle
- **Consumers**: `examples/lifecycle-cli`

## Key Directories

- `src/services/` -- assessment service (lifecycle evaluation logic)
- `src/agents/` -- AI lifecycle advisor agent
- `src/events/` -- lifecycle domain events
- `src/api/` -- REST handler adapters
- `src/__tests__/` -- unit tests

## Public Exports

- `.` -- `AssessmentService`, lifecycle events, lifecycle advisor agent, REST handlers

## Guardrails

- Depends on six workspace packages (`lib.ai-agent`, `lib.analytics`, `lib.lifecycle`, `lib.observability`, `module.lifecycle-advisor`, `module.lifecycle-core`); changes to those APIs propagate here.
- Events must remain serializable for cross-service consumption.
- Keep REST handlers thin; domain logic belongs in services.

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Lint: `bun run lint`
- Test: `bun test`
- Typecheck: `bun run typecheck`
