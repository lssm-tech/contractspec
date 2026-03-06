# AI Agent Guide -- `@contractspec/module.provider-ranking`

Scope: `packages/modules/provider-ranking/*`

AI provider ranking module with persistence adapters and pipeline orchestration for benchmark ingestion and scoring.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (library), apps (registry-server)

## Public Exports

- `.` -- root barrel
- `./entities` -- domain entities (RankedProvider, BenchmarkResult, ModelProfile)
- `./storage` -- storage adapters and interfaces
- `./pipeline` -- ranking pipeline orchestration (ingest, score, refresh)

## Guardrails

- Depends on `lib.provider-ranking` for scoring logic and ingesters -- this module adds persistence and orchestration
- Pipeline stages must be idempotent; re-ingesting the same benchmark data should not create duplicates
- Storage adapters are swappable -- always code against the interface, not the implementation

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
