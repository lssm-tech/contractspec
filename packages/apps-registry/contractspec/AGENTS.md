# AI Agent Guide -- `contractspec`

Scope: `packages/apps-registry/contractspec/*`

npm-published CLI entry point for ContractSpec. Thin wrapper that delegates to `@contractspec/app.cli-contractspec` via `bin/contractspec.mjs`.

## Quick Context

- **Layer**: apps-registry
- **Consumers**: end-users installing `npx contractspec` or `bun x contractspec`

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `bin/contractspec.mjs` | CLI binary entry point |

## Guardrails

- This package is a shim; all logic lives in `@contractspec/app.cli-contractspec`
- Do not add dependencies beyond the CLI app workspace reference
- Changes to `bin/contractspec.mjs` affect every user -- test locally before publishing

## Local Commands

- Publish: `bun run publish:pkg`
