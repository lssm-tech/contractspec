# AI Agent Guide -- `@contractspec/example.learning-journey-crm-onboarding`

Scope: `packages/examples/learning-journey-crm-onboarding/*`

Demonstrates a learning journey track that onboards users to the CRM pipeline example with guided steps.

## Quick Context

- **Layer**: example
- **Related Packages**: `module.learning-journey`, `lib.contracts-spec`, `lib.schema`, `example.crm-pipeline`

## What This Demonstrates

- CRM-specific onboarding track with step-by-step guidance
- Feature definition with operations, presentations, and test-specs
- Demo handlers for simulated onboarding flow
- Cross-example dependency (builds on crm-pipeline)

## Public Exports

- `.` -- root barrel
- `./learning-journey-crm-onboarding.feature` -- feature definition
- `./operations` -- onboarding operations
- `./presentations` -- step presentations
- `./handlers/demo.handlers` -- demo handlers
- `./tests/operations.test-spec` -- operation test specifications
- `./track` -- CRM onboarding track definition
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Typecheck: `bun run typecheck`
