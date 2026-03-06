# AI Agent Guide -- `@contractspec/example.calendar-google`

Scope: `packages/examples/calendar-google/*`

Demonstrates Google Calendar integration for listing and creating events via the googleapis SDK.

## Quick Context

- **Layer**: example
- **Related Packages**: `integration.providers-impls`, `lib.contracts-spec`, `googleapis`

## What This Demonstrates

- OAuth-based Google Calendar API wiring
- Event listing and creation flows
- Sync logic for calendar data
- Integration provider pattern with ContractSpec contracts

## Public Exports

- `.` -- root barrel
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point
- `./run` -- execution runner
- `./sync` -- calendar sync logic

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`
