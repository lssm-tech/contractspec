# AI Agent Guide — `registry-server`

Scope: `packages/apps/registry-server/*`

ContractSpec registry server. Serves contract specs and metadata over HTTP for IDE plugins, CLI tools, and other consumers.

## Quick Context

- **Layer**: app (API server)
- **Consumers**: IDE plugins, CLI tools, CI pipelines

## Architecture

- Built with Elysia (Bun HTTP framework)
- Uses `@contractspec/lib.contracts-spec` for contract definitions
- Uses `@contractspec/lib.logger` for structured logging
- Separate handlers for ContractSpec and LSSM routes

## Key Files

- `src/index.ts` — App entry point
- `src/server.ts` — Elysia server setup
- `src/handlers/contractspec-handler.ts` — ContractSpec API routes
- `src/handlers/lssm-handler.ts` — LSSM-specific API routes
- `src/utils/` — Filesystem and path utilities

## Public Exports

N/A (deployable app)

## Guardrails

- API routes are consumed by IDE plugins and CI — do not change paths or response shapes without versioning
- Filesystem access must use the `src/utils/` helpers for consistent path resolution

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Start: `bun run start`
- Lint: `bun run lint`
