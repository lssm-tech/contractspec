# AI Agent Guide — `@contractspec/bundle.marketing`

Scope: `packages/bundles/marketing/*`

Marketing bundle with docs, email templates, and landing page components.

## Quick Context

- **Layer**: bundle
- **Consumers**: `app.web-landing`
- **Dependencies**: `bundle.library`, `lib.email`

## Architecture

- `src/components/docs/` — Documentation pages
- `src/components/marketing/` — Landing page sections
- `src/components/templates/` — Template preview
- `src/libs/email/` — Email templates and utilities

## Public Exports

Use subpath imports:

```typescript
import { LandingPage } from "@contractspec/bundle.marketing/components/marketing";
import { DocsIndexPage } from "@contractspec/bundle.marketing/components/docs";
```

## Guardrails

- Landing page sections are composed by `app.web-landing` — keep component props stable.
- Email templates must render correctly in major email clients; test with Litmus or equivalent.
- Do not import from other bundles except through shared lib interfaces.

## Local Commands

- Build: `bun run build`
- Types: `bun run build:types`
- Lint: `bun run lint`
