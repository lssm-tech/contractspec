# AI Agent Guide — `@contractspec/lib.evolution`

Scope: `packages/libs/evolution/*`

AI-powered contract evolution engine. Drives migration strategies when contracts change over time.

## Quick Context

- **Layer**: lib
- **Consumers**: example-shared-ui, bundles
- **Key dependencies**: ai-agent, contracts-spec, lifecycle, observability, schema

## Public Exports

| Subpath | Description |
| ------- | ----------- |
| `.`     | Main entry  |

## Guardrails

- Evolution strategies affect contract migration paths; changes can break existing migrations.
- Depends on multiple core libs — verify compatibility when updating any dependency.
- Strategy selection logic must remain deterministic and auditable.

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
