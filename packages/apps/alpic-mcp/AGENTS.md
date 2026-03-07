# AI Agent Guide — `alpic-mcp`

Scope: `packages/apps/alpic-mcp/*`

MCP (Model Context Protocol) server for Alpic. Exposes ContractSpec documentation and tooling to AI agents via the MCP standard.

## Quick Context

- **Layer**: app
- **Consumers**: AI agents, IDE integrations, MCP clients

## Architecture

- Uses `@contractspec/bundle.alpic` for Alpic business logic
- Uses `@contractspec/lib.logger` for structured logging
- Built with tsdown; runs as a Node.js server

## Key Files

- `src/server.ts` — MCP server entry point
- `src/index.ts` — Library exports

## Public Exports

- `.` → `dist/index.mjs`
- `./server` → `dist/server.mjs`

## Guardrails

- MCP protocol compliance is critical — do not break tool/resource schemas
- Keep server startup fast; defer heavy initialization

## Local Commands

- Build: `bun run build`
- Dev: `bun run dev`
- Start: `bun run start`
- Lint: `bun run lint`
