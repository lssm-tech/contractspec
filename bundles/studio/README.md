# @contractspec/bundle.studio

Core Studio bundle providing GraphQL API, business modules, and UI components for ContractSpec Studio.

## Overview

This bundle is the heart of ContractSpec Studio, providing:
- GraphQL schema and resolvers
- Business modules (evolution, integrations, lifecycle, analytics)
- Infrastructure (BYOK encryption, deployment orchestration)
- Presentation components (canvas, editor, project management)
- AI services (agent chat, MCP server)

## Installation

```bash
bun add @contractspec/bundle.studio
```

## Exports

### Application Layer
- `application/services/agent-chat` — AI chat service
- `application/services/auth` — Authentication service
- `application/mcp` — MCP server builder

### Domain
- `domain/*` — Domain models and business logic

### Infrastructure
- `infrastructure/graphql/*` — GraphQL schema, context, guards, modules
- `infrastructure/byok/*` — Bring Your Own Key encryption
- `infrastructure/deployment/*` — Deployment orchestration
- `infrastructure/elysia/*` — HTTP server utilities

### Modules
- `modules/analytics` — Analytics and metrics
- `modules/evolution` — Auto-evolution engine
- `modules/integrations` — Integration management
- `modules/knowledge` — Knowledge source management
- `modules/visual-builder` — Canvas and versioning

### Presentation
- `presentation/components/studio/*` — Canvas, editor, project components
- `presentation/components/lifecycle/*` — Lifecycle journey UI
- `presentation/components/learning/*` — Learning coach components
- `presentation/components/shell/*` — App shell layouts
- `presentation/hooks/studio/*` — React hooks for GraphQL

## Dependencies

- `@contractspec/lib.contracts-studio` — Studio contracts
- `@contractspec/lib.database-studio` — Prisma client
- `@contractspec/lib.evolution` — Evolution engine
- `@contractspec/bundle.library` — Shared components

## Related Packages

- [`@contractspec/app.api-studio`](../../apps/api-studio/README.md) — API server
- [`@contractspec/app.web-studio`](../../apps/web-studio/README.md) — Web app
- [`@contractspec/bundle.library`](../library/README.md) — Library bundle
