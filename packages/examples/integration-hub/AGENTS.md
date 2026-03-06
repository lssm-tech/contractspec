# AI Agent Guide -- `@contractspec/example.integration-hub`

Scope: `packages/examples/integration-hub/*`

Demonstrates an integration hub with sync engine, field mappings, connections, and MCP server support.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.ai-agent`, `lib.schema`, `lib.contracts-spec`, `lib.example-shared-ui`, `lib.design-system`, `lib.runtime-sandbox`

## What This Demonstrates

- Connection management with typed schemas and enums
- Integration lifecycle (create, configure, sync)
- Sync engine with field mapping and status tracking
- MCP server example for tool integration
- Capability and feature definition patterns
- React UI with dashboard, hooks, and markdown renderers
- Event definitions and operation test-specs

## Public Exports

- `.` -- root barrel
- `./connection` -- connection enum, operation, presentation, schema
- `./integration` -- integration enum, operations, presentation, schema
- `./integration-hub.capability`, `./integration-hub.feature` -- capability and feature
- `./sync` -- sync enum, operations, presentation, schema
- `./sync-engine` -- sync execution engine
- `./handlers` -- integration handlers
- `./events` -- event definitions
- `./seeders` -- demo data
- `./mcp-example`, `./run-mcp` -- MCP server example
- `./ui` -- React components, hooks, renderers
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Run MCP: `bun run run:mcp`
- Validate: `bun run validate`
- Typecheck: `bun run typecheck`
