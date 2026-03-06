# AI Agent Guide -- `@contractspec/module.context-storage`

Scope: `packages/modules/context-storage/*`

Context storage module providing snapshot persistence, retrieval, and pipeline orchestration for context packs.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (library), apps (registry-server)

## Public Exports

- `.` -- root barrel
- `./entities` -- domain entities (ContextSnapshot, ContextPack)
- `./storage` -- storage adapters and interfaces
- `./pipeline` -- context snapshot pipeline orchestration

## Guardrails

- Depends on `lib.context-storage`, `lib.knowledge`, `lib.contracts-integrations`
- Pipeline stages must be idempotent; re-running a snapshot should not duplicate data
- Storage adapters are swappable -- always code against the interface, not the implementation

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
