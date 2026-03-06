# AI Agent Guide -- `@contractspec/example.integration-posthog`

Scope: `packages/examples/integration-posthog/*`

Demonstrates PostHog analytics integration for event capture, HogQL queries, and feature flag management.

## Quick Context

- **Layer**: example
- **Related Packages**: `integration.providers-impls`, `lib.contracts-spec`

## What This Demonstrates

- PostHog event capture and tracking setup
- HogQL query execution pattern
- Feature flag management via PostHog API
- Integration provider pattern with ContractSpec contracts

## Public Exports

- `.` -- root barrel
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point
- `./posthog` -- PostHog client wiring
- `./run` -- execution runner

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`
