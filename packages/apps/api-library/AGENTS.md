# AI Agent Guide — `@contractspec/app.api-library`

Scope: `packages/apps/api-library/*`

Library API server for ContractSpec documentation, templates, and MCP servers. Thin HTTP layer over `bundle.library`.

## Quick Context

- **Layer**: app (Elysia HTTP server)
- **Consumers**: web-landing, external API clients, MCP integrations

## Architecture

- This app is a thin HTTP layer — all business logic lives in `bundle.library`.
- Elysia server with MCP endpoint integration.

## Key Files

- `src/server.ts` — Elysia server setup
- `src/handlers/mcp-handler.ts` — MCP endpoint integration

## Guardrails

- Keep this app thin — no business logic here; delegate to `bundle.library`.
- MCP handler changes may affect VS Code extension and CLI consumers.
- API route changes require coordinating with `app.web-landing` and any external clients.

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Start: `bun run start`
