# AI Agent Guide -- `@contractspec/example.analytics-dashboard`

Scope: `packages/examples/analytics-dashboard/*`

Demonstrates an analytics dashboard with configurable widgets, a query engine, and PostHog datasource integration.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.schema`, `lib.contracts-spec`, `lib.contracts-integrations`, `lib.example-shared-ui`, `lib.design-system`, `lib.runtime-sandbox`

## What This Demonstrates

- Dashboard feature with presentation, schema, enum, and test-spec
- Query engine with typed operations and handlers
- PostHog datasource adapter
- React UI with hooks, renderers, and markdown output
- Event definitions for analytics tracking
- Seeders for demo data

## Public Exports

- `.` -- root barrel
- `./dashboard` -- dashboard enum, operation, presentation, schema, test-spec
- `./dashboard.feature` -- feature definition
- `./query` -- query enum, operation, presentation, schema, test-spec
- `./query-engine` -- query execution engine
- `./datasource/posthog-datasource` -- PostHog adapter
- `./handlers` -- analytics and query handlers
- `./events` -- event definitions
- `./seeders` -- demo data
- `./ui` -- React components, hooks, renderers
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`
