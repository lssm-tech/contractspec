# AI Agent Guide -- `@contractspec/integration.example-generator`

Scope: `packages/integrations/example-generator/*`

Example plugin that generates Markdown documentation from ContractSpec specs. Use as a reference when building new generator plugins.

## Quick Context

- **Layer**: integration
- **Consumers**: plugin authors, documentation pipelines

## Public Exports

| Subpath | Purpose |
| --- | --- |
| `.` | Main entry (re-exports) |
| `./config` | Generator configuration |
| `./generator` | Core Markdown generation logic |
| `./types` | Shared type definitions |

## Guardrails

- Do not add business logic; this is a reference plugin
- Keep the export surface minimal -- new exports need a clear use-case
- Peer-depends on `contracts-spec` and `schema`; do not bundle them

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
