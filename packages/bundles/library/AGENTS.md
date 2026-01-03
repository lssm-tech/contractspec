# bundle.library

Shared library bundle with docs, templates, MCP servers, and common components.

## Quick Context

- **Type**: Bundle (shared business logic)
- **Consumers**: `app.api-library`, `app.web-landing`, `app.web-studio`

## Key Directories

- `src/application/mcp/` — MCP server implementations
- `src/components/docs/` — Documentation pages
- `src/components/templates/` — Template implementations
- `src/components/integrations/` — Integration marketplace
- `src/hooks/studio/` — React hooks for GraphQL
- `src/providers/auth/` — Authentication providers

## Exports

Use subpath imports:
```typescript
import { ... } from '@contractspec/bundle.library/components/docs';
import { ... } from '@contractspec/bundle.library/hooks/studio';
```

## Commands

```bash
bun build       # Build bundle
bun build:types # Type check
bun lint        # Lint code
```
