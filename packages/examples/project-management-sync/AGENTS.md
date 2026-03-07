# AI Agent Guide -- `@contractspec/example.project-management-sync`

Scope: `packages/examples/project-management-sync/*`

Project management sync example: Linear, Jira, and Notion work item creation from contracts.

## Quick Context

- **Layer**: example
- **Related Packages**: `integration.providers-impls`, `lib.contracts-spec`

## What This Demonstrates

- Multi-provider sync pattern (Linear, Jira, Notion)
- Work item creation from contract definitions
- Run script for one-shot execution

## Public Exports

- `.` -- root barrel
- `./sync` -- sync logic
- `./run` -- execution entry point
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`
