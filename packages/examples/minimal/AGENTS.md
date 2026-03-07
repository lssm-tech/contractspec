# AI Agent Guide -- `contractspec-example-minimal`

Scope: `packages/examples/minimal/*`

Minimal ContractSpec example showing the simplest possible contract definition and build.

## Quick Context

- **Layer**: example
- **Related Packages**: `contractspec` (CLI), `lib.contracts-spec`

## What This Demonstrates

- Bare-minimum contract definition (user contract)
- `contractspec build` and `contractspec validate` CLI usage
- Private package pattern (not published)

## Public Exports

None (private package, run via CLI scripts).

## Local Commands

- Build: `contractspec build src/contracts/user.ts`
- Validate: `contractspec validate src/contracts/user.ts`
