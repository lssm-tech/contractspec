# AI Agent Guide -- `@lssm/app.video-studio`

Scope: `packages/apps/video-studio/*`

This is a thin Remotion Studio wrapper. It re-exports the Remotion entry point from `@lssm/lib.video-gen`.

## Commands

```bash
# Start Remotion Studio (preview all compositions)
bun run dev

# Render a specific composition
bun run render -- ApiOverview out/api-overview.mp4

# Render all compositions
bun run render:all
```

## Working rules

- Do NOT add compositions here. All compositions live in `@lssm/lib.video-gen`.
- This package exists solely to provide a Remotion Studio entry point.
- Requires Node.js (Remotion does not run on Bun).
