# AI Agent Guide — `@contractspec/lib.image-gen`

Scope: `packages/libs/image-gen/*`

AI-powered image generation for hero, social, thumbnail, OG, and illustration assets. Provides generators, presets, and i18n support.

## Quick Context

- **Layer**: lib
- **Consumers**: video-gen, bundles

## Public Exports

| Subpath        | Description              |
| -------------- | ------------------------ |
| `.`            | Main entry               |
| `./docs/*`     | Documentation blocks     |
| `./generators` | Generator implementations|
| `./i18n`       | Internationalization     |
| `./presets`    | Image preset schemas     |
| `./types`      | Shared type definitions  |

## Guardrails

- Generator interface is shared with the content-gen pattern; keep the adapter shape consistent.
- Preset schemas affect all generated images; field changes require validation across consumers.
- Do not hardcode locale-specific strings outside the i18n subpath.

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
