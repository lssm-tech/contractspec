# AI Agent Guide — `@contractspec/lib.video-gen`

Scope: `packages/libs/video-gen/*`

AI-powered video generation with Remotion: compositions, rendering, and design integration.

## Quick Context

- **Layer**: lib
- **Consumers**: bundles, video-studio app

## Public Exports

- `.` — main entry
- `./compositions` — Remotion composition definitions
- `./design` — design tokens and visual config
- `./docs` — documentation generation
- `./generators` — video generation pipelines
- `./i18n` — internationalization
- `./player` — video player component
- `./remotion` — Remotion integration layer
- `./renderers` — renderer interface and implementations
- `./types` — shared type definitions

## Guardrails

- Remotion composition API is version-sensitive — pin and test upgrades carefully
- Renderer interface is the adapter boundary — do not leak Remotion internals
- Depends on voice, content-gen, image-gen, design-system — coordinate cross-lib changes

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
