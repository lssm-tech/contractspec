# bundle.marketing

Marketing bundle with docs, email templates, and landing page components.

## Quick Context

- **Type**: Bundle (marketing components)
- **Consumers**: `app.web-landing`

## Key Directories

- `src/components/docs/` — Documentation pages
- `src/components/marketing/` — Landing page sections
- `src/components/templates/` — Template preview
- `src/libs/email/` — Email templates and utilities

## Exports

Use subpath imports:
```typescript
import { LandingPage } from '@contractspec/bundle.marketing/components/marketing';
import { DocsIndexPage } from '@contractspec/bundle.marketing/components/docs';
```

## Commands

```bash
bun build       # Build bundle
bun build:types # Type check
bun lint        # Lint code
```

## Dependencies

- `bundle.library` — Shared components
- `lib.email` — Email service
