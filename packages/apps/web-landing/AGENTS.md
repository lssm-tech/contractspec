# AI Agent Guide — `@contractspec/app.web-landing`

Scope: `packages/apps/web-landing/*`

Marketing landing page and documentation site for ContractSpec. Next.js application consuming `bundle.marketing` and `bundle.library`.

## Quick Context

- **Layer**: app (Next.js)
- **Consumers**: end users (public website)

## Architecture

- `src/app/(landing-marketing)/` — Marketing pages
- `src/app/(docs)/` — Documentation pages

## Key Files

- Marketing landing page
- Documentation pages
- Pricing and contact
- Template gallery
- Newsletter signup

## Guardrails

- Keep this app thin — page content and components come from `bundle.marketing` and `bundle.library`.
- Uses Tailwind CSS v4 with PostCSS — do not introduce competing CSS solutions.
- Route changes affect SEO and external links; coordinate with marketing.

## Local Commands

- Dev: `bun run dev`
- Build: `bun run build`
- Start: `bun run start`
