# AI Agent Guide -- `spec-driven-development`

Scope: `packages/apps-registry/spec-driven-development/*`

npm-published CLI alias for ContractSpec under the `sdd` / `spec-driven-development` binary names. Thin wrapper that delegates to `@contractspec/app.cli-contractspec`.

## Quick Context

- **Layer**: apps-registry
- **Consumers**: end-users installing `npx sdd` or `npx spec-driven-development`

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `bin/contractspec.mjs` | CLI binary entry point (aliased as `sdd` and `spec-driven-development`) |

## Guardrails

- This package is a shim; all logic lives in `@contractspec/app.cli-contractspec`
- Do not add dependencies beyond the CLI app workspace reference
- Changes to `bin/contractspec.mjs` affect every user -- test locally before publishing

## Local Commands

- Publish: `bun run publish:pkg`
