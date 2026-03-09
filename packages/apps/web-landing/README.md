# @contractspec/app.web-landing

Marketing landing page and documentation site for ContractSpec.

## ContractSpec Studio

Studio is live at https://www.contractspec.studio.

Positioning used across this app:

- ContractSpec Studio is the AI-powered product decision engine.
- It turns product signals into spec-first deliverables.
- Core loop: Evidence -> Correlation -> Decision -> Change -> Export -> Check -> Notify -> Autopilot.

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
- 📧 **Email** — Newsletter and Studio signup integration
- 📊 **Analytics** — PostHog and Vercel Analytics

## Agent and LLM support

- **`/llms`** — Global monorepo summary (also `/llms.txt`, `/llms.md`); static file at `public/llms.txt`
- **`/llms-full.txt`** — All package READMEs aggregated; run `bun run llms:generate` to regenerate
- **`/llms/[slug]`** — Per-package guide (e.g. `/llms/lib.ai-agent`); returns README as text/plain
- **`AGENTS.md`** — AI agent guide with routing, API surfaces, and entry points
- **MCP** — Docs MCP server at `GET/POST /api/mcp`

## dependencies

- `@contractspec/bundle.marketing` — Marketing pages and email templates
- `@contractspec/bundle.library` — Shared library components
- `@contractspec/bundle.studio` — Studio components for sandbox
- `@contractspec/lib.design-system` — Design tokens and atoms

## Contributing

This application is a **thin adapter**.

- **Want to change the design or content?**
  - Go to `packages/bundles/marketing` for landing pages.
  - Go to `packages/bundles/library` for documentation and templates.
- **Want to change the routing or config?**
  - Edit this package.

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
