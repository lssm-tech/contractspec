# AI Agent Guide -- `contractspec-example-opencode-cli`

Scope: `packages/examples/opencode-cli/*`

OpenCode CLI example showing agent-mode contract building and validation.

## Quick Context

- **Layer**: example
- **Related Packages**: `contractspec` (CLI), `lib.contracts-spec`

## What This Demonstrates

- Agent-mode (`--agent-mode opencode`) contract compilation
- Implementation checking via `--check-implementation`
- Private package pattern (not published)

## Public Exports

None (private package, run via CLI scripts).

## Local Commands

- Build: `contractspec build src/contracts/opencode.contracts.ts --agent-mode opencode`
- Validate: `contractspec validate src/contracts/opencode.contracts.ts --check-implementation --agent-mode opencode`
