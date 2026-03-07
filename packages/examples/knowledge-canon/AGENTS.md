# AI Agent Guide -- `@contractspec/example.knowledge-canon`

Scope: `packages/examples/knowledge-canon/*`

Demonstrates a Product Canon knowledge space with blueprint, tenant config, source samples, and agent wiring.

## Quick Context

- **Layer**: example
- **Related Packages**: `lib.contracts-spec`

## What This Demonstrates

- Knowledge space blueprint definition
- Multi-tenant configuration for knowledge bases
- Source sample for content ingestion
- Agent helper for knowledge retrieval
- Minimal contract-only example pattern

## Public Exports

- `.` -- root barrel
- `./agent` -- knowledge agent helper
- `./blueprint` -- Product Canon blueprint
- `./docs` -- DocBlock documentation
- `./example` -- runnable example entry point
- `./source.sample` -- sample content source
- `./tenant` -- tenant configuration

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Test: `bun test`
- Typecheck: `bun run typecheck`
