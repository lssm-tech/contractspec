# AI Agent Guide -- `@contractspec/example.learning-journey-platform-tour`

Scope: `packages/examples/learning-journey-platform-tour/*`

Demonstrates a guided tour of ContractSpec platform primitives as a learning journey track.

## Quick Context

- **Layer**: example
- **Related Packages**: `module.learning-journey`, `lib.contracts-spec`, `lib.schema`

## What This Demonstrates

- Platform primitives tour with step-by-step guidance
- Feature definition with operations, presentations, and test-specs
- Demo handlers for simulated tour flow
- Interactive exploration of ContractSpec concepts

## Public Exports

- `.` -- root barrel
- `./learning-journey-platform-tour.feature` -- feature definition
- `./operations` -- tour operations
- `./presentations` -- step presentations
- `./handlers/demo.handlers` -- demo handlers
- `./tests/operations.test-spec` -- operation test specifications
- `./track` -- platform tour track definition
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`
