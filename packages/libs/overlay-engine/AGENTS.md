# AI Agent Guide — `@contractspec/lib.overlay-engine`

Scope: `packages/libs/overlay-engine/*`

Runtime overlay engine for personalization and adaptive UI rendering. Provides spec-driven overlay merging, signing, and validation.

## Quick Context

- **Layer**: lib
- **Consumers**: personalization, example-shared-ui, bundles

## Public Exports

- `.` — main entry
- `./merger` — overlay merge logic
- `./react` — React bindings
- `./registry` — overlay registry
- `./runtime` — runtime engine
- `./signer` — cryptographic signing
- `./spec` — overlay spec schema
- `./types` — shared type definitions
- `./validator` — overlay validation

## Guardrails

- Overlay spec schema is a contract — changes are breaking for all consumers
- Signer must preserve cryptographic integrity; do not alter signing algorithm without migration
- Merger logic must be idempotent — applying the same overlay twice must produce identical results

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
