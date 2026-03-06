# AI Agent Guide — `@contractspec/lib.content-gen`

Scope: `packages/libs/content-gen/*`

AI-powered content generation for blog, email, and social media channels.

## Quick Context

- **Layer**: lib
- **Consumers**: image-gen, voice, video-gen, bundles

## Public Exports

- `.` — main entry
- `./generators`
- `./i18n`
- `./seo`
- `./types`

## Guardrails

- Generator interface is shared across media libs (image-gen, voice, video-gen); keep it stable.
- i18n keys must stay in sync with consuming packages.

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
