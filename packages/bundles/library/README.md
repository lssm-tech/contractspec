# @contractspec/bundle.library

Shared library bundle providing documentation pages, templates, MCP servers, and common UI components.

## Overview

This bundle provides reusable components for the library experience:
- Documentation pages (getting-started, integrations, architecture)
- Template components (todos, recipes, CRM, messaging, etc.)
- MCP (Model Context Protocol) servers for AI integration
- Learning journey components
- Auth providers
- Marketing sections

## Installation

```bash
bun add @contractspec/bundle.library
```

## Exports

### Application Layer
- `application/mcp` — MCP server implementations (CLI, docs, internal)

### Components
- `components/docs/*` — Documentation pages by category
- `components/templates/*` — Template implementations
- `components/integrations/*` — Integration marketplace components
- `components/learning/*` — Learning journey and coaching
- `components/marketing/*` — Marketing sections and pages

### Hooks
- `hooks/studio/*` — Studio query and mutation hooks

### Infrastructure
- `infrastructure/elysia` — Elysia HTTP utilities
- `infrastructure/runtime-local-web` — Browser-based runtime

### Providers
- `providers/auth` — Authentication context and guards

## Dependencies

- `@contractspec/lib.design-system` — Design tokens
- `@contractspec/lib.ui-kit-web` — UI components
- `@contractspec/lib.contracts-library` — Library contracts
- `@contractspec/lib.database-studio` — Database types

## Related Packages

- [`@contractspec/app.api-library`](../../apps/api-library/README.md) — API server
- [`@contractspec/bundle.marketing`](../marketing/README.md) — Marketing bundle
- [`@contractspec/bundle.studio`](../studio/README.md) — Studio bundle
