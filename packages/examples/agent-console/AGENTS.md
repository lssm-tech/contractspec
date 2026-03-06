# AI Agent Guide -- `@contractspec/example.agent-console`

Scope: `packages/examples/agent-console/*`

Demonstrates AI agent orchestration with tools, runs, and execution logs using the ContractSpec spec-first pattern.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.schema`, `lib.contracts-spec`, `lib.example-shared-ui`, `lib.design-system`, `lib.runtime-sandbox`

## What This Demonstrates

- Agent entity with lifecycle (create, configure, execute)
- Run tracking with status enums and event-driven state transitions
- Tool registry with typed schemas and operation handlers
- Presentation layer with React UI components, hooks, modals, and overlays
- Markdown and React renderers for multi-surface output
- Seeders and mock data for demo scenarios

## Public Exports

- `.` -- root barrel
- `./agent` -- agent entity, enum, event, handler, operation, presentation, schema, test-spec
- `./agent.capability`, `./agent.feature` -- capability and feature definitions
- `./run` -- run entity, enum, event, handler, operation, presentation, schema, test-spec
- `./tool` -- tool entity, enum, event, handler, operation, presentation, schema, test-spec
- `./handlers` -- operation handlers
- `./presentations` -- presentation definitions
- `./seeders`, `./shared` -- mock data and shared types
- `./ui` -- React components, hooks, modals, overlays, renderers, views
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`
