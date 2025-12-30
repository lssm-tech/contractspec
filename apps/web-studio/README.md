# @contractspec/app.web-studio

ContractSpec Studio web application for managing projects, specs, and deployments.

## Overview

Next.js application providing the main Studio interface:
- Project management dashboard
- Visual spec builder
- Canvas editor with drag-and-drop
- Deployment management
- Team collaboration
- Learning journey and onboarding

## Usage

```bash
# Development
bun dev

# Production build
bun build
bun start
```

## Features

- 🎨 **Visual Builder** — Drag-and-drop spec construction
- 📊 **Dashboard** — Project and team management
- 🚀 **Deployments** — One-click deployment
- 🤖 **AI Assistant** — Integrated AI chat
- 📚 **Learning** — Interactive onboarding tracks
- 🔐 **Auth** — Better Auth integration

## Dependencies

- `@contractspec/bundle.studio` — Core studio components and hooks
- `@contractspec/lib.database-studio` — Database types
- `@contractspec/lib.design-system` — Design tokens and atoms
- `@contractspec/lib.progressive-delivery` — Feature flags

## Package Structure

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/             # Authentication pages
│   ├── (studio)/           # Studio pages
│   └── api/                # API routes
├── components/             # Page-specific components
└── lib/                    # Utilities
```

## Related Packages

- [`@contractspec/bundle.studio`](../../bundles/studio/README.md) — Business logic
- [`@contractspec/app.api-studio`](../api-studio/README.md) — API server
- [`@contractspec/app.web-landing`](../web-landing/README.md) — Marketing site
