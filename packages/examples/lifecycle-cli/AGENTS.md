# AI Agent Guide -- `@contractspec/example.lifecycle-cli`

Scope: `packages/examples/lifecycle-cli/*`

CLI demo that runs lifecycle assessment without an HTTP server.

## Quick Context

- **Layer**: example
- **Related Packages**: `bundle.lifecycle-managed`, `lib.lifecycle`, `lib.contracts-spec`, `lib.logger`

## What This Demonstrates

- Headless lifecycle assessment execution via CLI
- Bundle consumption pattern (lifecycle-managed)
- Logger integration for CLI output

## Public Exports

- `.` -- root barrel
- `./demo` -- runnable demo script
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`
