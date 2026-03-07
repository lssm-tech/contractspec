# AI Agent Guide — `@contractspec/bundle.library`

Scope: `packages/bundles/library/*`

Shared library bundle with docs, templates, MCP servers, and common components.

## Quick Context

- **Layer**: bundle
- **Consumers**: `app.api-library`, `app.web-landing`, `app.web-studio`

## Architecture

- `src/application/mcp/` — MCP server implementations
- `src/components/docs/` — Documentation pages
- `src/components/templates/` — Template implementations
- `src/components/integrations/` — Integration marketplace
- `src/hooks/studio/` — React hooks for GraphQL
- `src/providers/auth/` — Authentication providers

## Public Exports

Use subpath imports:

```typescript
import { ... } from "@contractspec/bundle.library/components/docs";
import { ... } from "@contractspec/bundle.library/hooks/studio";
```

## Guardrails

- This bundle is consumed by multiple apps — breaking export changes cascade widely.
- MCP server implementations must stay transport-agnostic (the app layer wires the transport).
- Keep side effects behind explicit adapters; do not perform I/O at import time.

## Local Commands

- Build: `bun run build`
- Types: `bun run build:types`
- Lint: `bun run lint`
