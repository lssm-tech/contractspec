# @contractspec/app.video-studio

**Thin Remotion Studio wrapper. Re-exports the Remotion entry point from `@contractspec/lib.video-gen`.**

## What It Does

- **Layer**: app (Remotion Studio)
- **Consumers**: internal — video preview and rendering

## Running Locally

From `packages/apps/video-studio`:
- `bun run dev`
- `bun run build`

## Usage

```bash
bun run dev
```

## Local Commands

- `bun run dev` — bunx remotionb studio src/index.ts
- `bun run build` — echo 'No build step needed for Remotion Studio'
- `bun run clean` — rimraf out .turbo
- `bun run render` — bunx remotionb render src/index.ts
- `bun run render:all` — bunx remotionb render src/index.ts ApiOverview out/api-overview.mp4 && bunx remotionb render src/index.ts SocialClip out/social-clip.mp4 && bunx remotionb render src/index.ts SocialClipSquare out/social-clip-square.mp4 && bunx remotionb render src/index.ts SocialClipPortrait out/social-clip-portrait.mp4 && bunx remotionb render src/index.ts TerminalDemo out/terminal-demo.mp4

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- Improve agentpacks
- Switch Remotion CLI to bunx remotionb for Bun runtime support

## Notes

- Do NOT add compositions here. All compositions live in `@contractspec/lib.video-gen`.
- This package exists solely to provide a Remotion Studio entry point.
- Uses `remotionb` CLI for Bun runtime support. Known caveat: SSR scripts may not auto-quit (see [Remotion Bun docs](https://www.remotion.dev/docs/bun)).
