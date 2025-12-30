# @contractspec/bundle.marketing

Marketing-focused bundle providing documentation pages, email templates, and landing page components.

## Overview

This bundle provides components specifically for marketing and documentation:
- Documentation pages (same as library, for standalone use)
- Marketing landing page sections
- Email templates (waitlist, newsletter, contact)
- Pricing examples and comparisons
- Template preview components

## Installation

```bash
bun add @contractspec/bundle.marketing
```

## Exports

### Documentation
- `components/docs/*` — Full documentation pages by category
  - `/advanced` — MCP, overlays, renderers, telemetry
  - `/architecture` — App config, multi-tenancy, integrations
  - `/comparison` — Platform comparisons
  - `/getting-started` — CLI, installation, tutorials
  - `/integrations` — Third-party service integrations
  - `/knowledge` — Knowledge management
  - `/libraries` — Library documentation
  - `/safety` — Security, auditing, migrations
  - `/specs` — Spec types and policies
  - `/studio` — Studio features

### Marketing
- `components/marketing/*` — Landing page sections
  - `HeroMarketingSection`, `ProblemSection`, `SolutionSection`
  - `AudienceSection`, `DevelopersSection`, `FearsSection`
  - `PricingClient`, `ContactClient`, `ChangelogPage`

### Templates
- `components/templates/*` — Template preview and gallery

### Email
- `libs/email/*` — Email utilities and templates

## Dependencies

- `@contractspec/lib.design-system` — Design tokens
- `@contractspec/lib.ui-kit-web` — UI components
- `@contractspec/bundle.library` — Shared library components
- `@contractspec/lib.email` — Email service

## Related Packages

- [`@contractspec/app.web-landing`](../../apps/web-landing/README.md) — Marketing site
- [`@contractspec/bundle.library`](../library/README.md) — Library bundle
