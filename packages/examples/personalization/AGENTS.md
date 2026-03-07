# AI Agent Guide -- `@contractspec/example.personalization`

Scope: `packages/examples/personalization/*`

Personalization examples: behavior tracking, overlay customization, and workflow extension.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.personalization`, `lib.overlay-engine`, `lib.workflow-composer`, `lib.contracts-spec`, `lib.logger`

## What This Demonstrates

- Behavior tracking integration pattern
- Overlay customization via overlay-engine
- Workflow extension via workflow-composer
- Multi-lib composition in a single example

## Public Exports

- `.` -- root barrel
- `./behavior-tracking` -- tracking patterns
- `./overlay-customization` -- overlay config
- `./workflow-extension` -- workflow extension
- `./docs`, `./example`

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test --pass-with-no-tests`
- Typecheck: `bun run typecheck`
