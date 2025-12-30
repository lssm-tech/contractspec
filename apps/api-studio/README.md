# @contractspec/app.api-studio

ContractSpec Studio API server providing GraphQL, AI-powered features, BYOK encryption, and deployment orchestration.

## Overview

This package provides the main Studio API server built with Elysia, featuring:
- GraphQL API for Studio operations
- AI provider integrations (Anthropic, OpenAI, Google, Mistral)
- BYOK (Bring Your Own Key) encryption
- Deployment orchestration
- Cost tracking

## Usage

```bash
# Development
bun dev

# Production build
bun build
bun start
```

## Configuration

Environment variables required:
- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Authentication secret
- AI provider API keys (optional, BYOK supported)

## Dependencies

- `@contractspec/bundle.studio` — Core studio bundle with GraphQL, modules, and presentation
- `@contractspec/lib.database-studio` — Prisma database client
- `@contractspec/lib.ai-providers` — AI SDK integrations
- `@contractspec/lib.cost-tracking` — Usage and cost tracking

## Package Structure

```
src/
├── generate.ts         # Code generation utilities
├── index.ts            # Entry point
└── server.ts           # Elysia server setup
```

## Related Packages

- [`@contractspec/bundle.studio`](../../bundles/studio/README.md) — Business logic and components
- [`@contractspec/app.web-studio`](../web-studio/README.md) — Web frontend
- [`@contractspec/app.api-library`](../api-library/README.md) — Library API server
