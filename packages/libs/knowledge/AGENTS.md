# AI Agent Guide — `@contractspec/lib.knowledge`

Scope: `packages/libs/knowledge/*`

RAG and knowledge base primitives. Provides retrieval, ingestion, and query interfaces for AI-powered knowledge workflows.

## Quick Context

- **Layer**: lib
- **Consumers**: ai-agent, personalization, support-bot, jobs, bundles

## Public Exports

- `.` — main entry
- `./access` — access control for knowledge items
- `./i18n` — internationalization helpers
- `./ingestion` — document ingestion pipeline
- `./query` — query builder and executor
- `./retriever` — retriever interface
- `./types` — shared type definitions

## Guardrails

- High blast radius — retriever interface is consumed by multiple AI libs
- Ingestion pipeline must stay idempotent; re-ingesting the same document must not create duplicates
- Type changes ripple into ai-agent, personalization, and support-bot

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
