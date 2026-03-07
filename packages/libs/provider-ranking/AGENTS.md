# AI Agent Guide — `@contractspec/lib.provider-ranking`

Scope: `packages/libs/provider-ranking/*`

AI provider ranking library: benchmark ingestion, composite scoring, and model comparison utilities.

## Quick Context

- **Layer**: lib
- **Consumers**: module.provider-ranking

## Public Exports

- `.` — main entry
- `./types` — shared type definitions
- `./store` — store interface (adapter boundary)
- `./in-memory-store` — default in-memory store implementation
- `./scoring` — composite scorer, normalizer, dimension weights
- `./ingesters` — benchmark data ingesters (Artificial Analysis, Chatbot Arena, SWE-bench, etc.)
- `./eval` — evaluation runner and types

## Guardrails

- Store interface is the adapter boundary — do not leak implementation details
- Scoring algorithms must stay deterministic (no randomness, no side effects)
- Benchmark dimension enum is shared across ingesters and scoring — keep in sync

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
