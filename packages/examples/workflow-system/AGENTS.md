# AI Agent Guide -- `@contractspec/example.workflow-system`

Scope: `packages/examples/workflow-system/*`

Workflow and approval system with state machine and role-based transitions.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.schema`, `lib.contracts-spec`, `lib.example-shared-ui`, `lib.design-system`, `lib.runtime-sandbox`

## What This Demonstrates

- State machine pattern for workflow transitions
- Approval flow with role-based access
- Multi-entity domain (workflow, instance, approval)
- Per-entity schema/enum/event/handler/operations pattern
- React UI with WorkflowDashboard, hooks, and renderers
- Capability and feature definition patterns
- Seeder and test-spec patterns

## Public Exports

- `.` -- root barrel
- `./workflow`, `./instance`, `./approval` -- domain modules
- `./state-machine` -- state machine logic
- `./entities` -- aggregate entity barrel
- `./handlers` -- workflow handlers
- `./presentations` -- presentation layer
- `./seeders` -- demo data
- `./shared` -- types and mock data
- `./workflow-system.capability`, `./workflow-system.feature`
- `./ui` -- WorkflowDashboard, hooks, renderers
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`
