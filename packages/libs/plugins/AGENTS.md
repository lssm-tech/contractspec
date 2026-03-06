# AI Agent Guide — `@contractspec/lib.plugins`

Scope: `packages/libs/plugins/*`

Plugin API and registry for ContractSpec extensions. Defines the plugin interface, configuration schema, and discovery mechanism.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, CLI

## Public Exports

- `.` — main entry
- `./config` — plugin configuration schema
- `./registry` — plugin registry and discovery
- `./types` — shared type definitions

## Guardrails

- Plugin interface is a public API contract — breaking changes affect all published plugins
- Registry must stay backward-compatible; older plugin manifests must remain loadable
- Config schema changes require a migration path for existing plugin configurations

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
