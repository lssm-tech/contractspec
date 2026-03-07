# AI Agent Guide — `@contractspec/lib.support-bot`

Scope: `packages/libs/support-bot/*`

AI support bot framework with RAG-powered answers, i18n, and ticket management.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles

## Public Exports

- `.` — main entry
- `./bot` — bot core logic
- `./i18n` — internationalization support
- `./rag` — retrieval-augmented generation pipeline
- `./spec` — bot spec interface (follows ai-agent patterns)
- `./tickets` — ticket schema and management
- `./types` — shared type definitions

## Guardrails

- Bot spec interface follows ai-agent patterns — keep aligned with contracts-spec
- Ticket schema is shared — changes affect consumers downstream
- RAG pipeline must stay compatible with the knowledge lib

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
