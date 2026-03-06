# AI Agent Guide — `@contractspec/lib.presentation-runtime-react`

Scope: `packages/libs/presentation-runtime-react/*`

React presentation runtime with workflow components. Provides stepper, renderer, and hooks for contract-driven UI workflows.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, apps

## Public Exports

- `.` — main entry
- `./nativewind-env.d` — NativeWind type declarations
- `./useWorkflow` — workflow state hook
- `./WorkflowStepper` — stepper component
- `./WorkflowStepRenderer` — step renderer component

## Guardrails

- Workflow component API is consumed by bundles — breaking changes require coordinated updates
- Must stay compatible with presentation-runtime-core interface
- Hook signatures (`useWorkflow`) are public API; parameter changes are breaking

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
