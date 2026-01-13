# api-library

Library API server for ContractSpec documentation, templates, and MCP servers.

## Quick Context

- **Type**: Elysia HTTP server
- **Purpose**: Serve docs, templates, and AI agent interfaces
- **Bundle**: `@contractspec/bundle.library`

## Key Files

- `src/server.ts` — Elysia server setup
- `src/handlers/mcp-handler.ts` — MCP endpoint integration

## Commands

```bash
bun dev    # Development with hot reload
bun build  # Production binary
bun start  # Run production binary
```

## Dependencies

Uses `bundle.library` for all business logic. This app is a thin HTTP layer.
