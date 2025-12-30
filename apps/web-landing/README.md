# @contractspec/app.web-landing

Marketing landing page and documentation site for ContractSpec.

## Overview

Next.js application providing:
- Marketing landing page
- Product documentation
- Pricing and contact pages
- Template gallery
- Newsletter signup

## Usage

```bash
# Development
bun dev

# Production build
bun build
bun start
```

## Features

- 🎨 **Modern Design** — Tailwind CSS with animations
- 📖 **Documentation** — Comprehensive docs pages
- 🚀 **Templates** — Interactive template gallery
- 📧 **Email** — Newsletter and waitlist integration
- 📊 **Analytics** — PostHog and Vercel Analytics

## Dependencies

- `@contractspec/bundle.marketing` — Marketing pages and email templates
- `@contractspec/bundle.library` — Shared library components
- `@contractspec/bundle.studio` — Studio components for sandbox
- `@contractspec/lib.design-system` — Design tokens and atoms

## Package Structure

```
src/
├── app/                    # Next.js app router
│   ├── (landing-marketing)/# Marketing pages
│   └── (docs)/             # Documentation pages
├── components/             # Page-specific components
└── lib/                    # Utilities
```

## Related Packages

- [`@contractspec/bundle.marketing`](../../bundles/marketing/README.md) — Marketing bundle
- [`@contractspec/app.web-studio`](../web-studio/README.md) — Studio web app
