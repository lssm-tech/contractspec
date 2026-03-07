# AI Agent Guide -- `@contractspec/example.learning-journey-studio-onboarding`

Scope: `packages/examples/learning-journey-studio-onboarding/*`

Demonstrates a guided onboarding track for the first 30 minutes in ContractSpec Studio.

## Quick Context

- **Layer**: example
- **Related Packages**: `module.learning-journey`, `lib.contracts-spec`, `lib.schema`

## What This Demonstrates

- Studio onboarding track with time-boxed steps
- Feature definition with operations, presentations, and test-specs
- Demo handlers for simulated onboarding flow
- First-run experience pattern for new users

## Public Exports

- `.` -- root barrel
- `./learning-journey-studio-onboarding.feature` -- feature definition
- `./operations` -- onboarding operations
- `./presentations` -- step presentations
- `./handlers/demo.handlers` -- demo handlers
- `./tests/operations.test-spec` -- operation test specifications
- `./track` -- studio onboarding track definition
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`
