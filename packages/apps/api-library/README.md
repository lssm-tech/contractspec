# @contractspec/app.api-library

Library API server providing documentation, templates, and MCP server endpoints for ContractSpec.

## Overview

This package provides a lightweight Elysia-based HTTP server that exposes:
- Documentation and learning resources
- Template library endpoints
- MCP (Model Context Protocol) server for AI agent integration

## Usage

```bash
# Development
bun dev

# Production build
bun build
bun start
```

## Dependencies

- `@contractspec/bundle.library` — Core library bundle with docs, templates, and MCP servers
- `@contractspec/bundle.workspace` — Workspace utilities
- `@contractspec/lib.contracts` — Contract definitions

## Package Structure

```
src/
├── handlers/           # HTTP request handlers
│   └── mcp-handler.ts  # MCP server integration
├── index.ts            # Entry point
└── server.ts           # Elysia server setup
```

## Related Packages

- [`@contractspec/bundle.library`](../../bundles/library/README.md) — Business logic and components
- [`@contractspec/app.api-studio`](../api-studio/README.md) — Studio API server
