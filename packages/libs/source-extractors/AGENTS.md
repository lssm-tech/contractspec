# AI Agent Guide — `@contractspec/lib.source-extractors`

Scope: `packages/libs/source-extractors/*`

Extract contract candidates from TypeScript source code across multiple frameworks (Zod, tRPC, Prisma, etc.).

## Quick Context

- **Layer**: lib
- **Consumers**: CLI, bundles

## Public Exports

- `.` — main entry
- `./codegen` — deterministic code generation from extracted contracts
- `./extractors` — framework-specific extractor implementations
- `./types` — shared type definitions

## Guardrails

- Extractor interface must support multiple frameworks — keep it generic
- Codegen output must stay deterministic (same input → same output, always)

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
