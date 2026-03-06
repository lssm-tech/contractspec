# AI Agent Guide -- `@contractspec/app.cursor-marketplace`

Scope: `packages/apps-registry/cursor-marketplace/*`

Cursor marketplace catalog containing plugin definitions (rules, commands, agents, skills, assets) for ContractSpec's Cursor IDE integrations.

## Quick Context

- **Layer**: apps-registry
- **Consumers**: Cursor IDE users, marketplace publishing pipeline

## Public Exports

| Path | Purpose |
| --- | --- |
| `plugins/contractspec/` | Core ContractSpec plugin (rules, commands, agents, skills) |
| `plugins/contractspec-ai-agent/` | AI agent governance plugin |
| `plugins/contractspec-contracts-spec/` | Contracts-spec authoring plugin |
| `plugins/contractspec-contracts-integrations/` | Integration contracts plugin |

## Guardrails

- Each plugin must have a valid `.cursor-plugin/plugin.json`
- Do not add runtime code; this package contains only declarative metadata
- Validate changes with `bun run validate` before publishing
- Logo assets in `assets/` must remain stable (referenced by marketplace)

## Local Commands

- Validate: `bun run validate`
