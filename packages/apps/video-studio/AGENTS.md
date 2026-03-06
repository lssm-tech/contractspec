# AI Agent Guide — `@contractspec/app.video-studio`

Scope: `packages/apps/video-studio/*`

Thin Remotion Studio wrapper. Re-exports the Remotion entry point from `@contractspec/lib.video-gen`.

## Quick Context

- **Layer**: app (Remotion Studio)
- **Consumers**: internal — video preview and rendering

## Guardrails

- Do NOT add compositions here. All compositions live in `@contractspec/lib.video-gen`.
- This package exists solely to provide a Remotion Studio entry point.
- Uses `remotionb` CLI for Bun runtime support. Known caveat: SSR scripts may not auto-quit (see [Remotion Bun docs](https://www.remotion.dev/docs/bun)).

## Local Commands

- Dev: `bun run dev` (start Remotion Studio)
- Render one: `bun run render -- ApiOverview out/api-overview.mp4`
- Render all: `bun run render:all`
