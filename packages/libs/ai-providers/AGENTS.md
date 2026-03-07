# AI Agent Guide — `@contractspec/lib.ai-providers`

Scope: `packages/libs/ai-providers/*`

Unified AI provider abstraction layer that normalizes access to multiple LLM backends.

## Quick Context

- **Layer**: lib
- **Consumers**: ai-agent, content-gen, image-gen, voice

## Public Exports

- `.` — main entry
- `./factory`
- `./legacy`
- `./models`
- `./types`
- `./validation`

## Guardrails

- Provider interface is consumed by all AI-powered libs; breaking changes cascade widely.
- Adding new providers must not break existing factory signatures.

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
