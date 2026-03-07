# AI Agent Guide — `@contractspec/lib.error`

Scope: `packages/libs/error/*`

Structured error handling and HTTP error utilities. Defines the canonical error shape used across the entire stack.

## Quick Context

- **Layer**: lib
- **Consumers**: many libs and bundles

## Public Exports

| Subpath      | Description                |
| ------------ | -------------------------- |
| `.`          | Main entry                 |
| `./appError` | AppError class and factory |
| `./codes`    | Error code constants       |
| `./http`     | HTTP status mappings       |

## Guardrails

- Error codes are a shared contract — additions are safe, removals or renames are breaking.
- `AppError` shape must stay stable; downstream serialization depends on it.
- HTTP status mappings affect all API surfaces; changes require cross-package validation.

## Local Commands

- Build: `bun run build`
- Lint: `bun run lint`
- Dev: `bun run dev`
