# @contractspec/app.video-studio

Website: https://contractspec.io/

Remotion Studio entry point for previewing and rendering ContractSpec video compositions.

This app is a thin wrapper around `@contractspec/lib.video-gen` -- it provides the Remotion Studio environment for live preview and CLI rendering. All compositions, generators, and design tokens live in the library; this package only registers them with Remotion.

## Quick Start

> Uses `remotionb` CLI for Bun runtime support. See [Remotion Bun docs](https://www.remotion.dev/docs/bun) for known caveats (`lazyComponent` disabled, SSR scripts may not auto-quit).

```bash
# Start Remotion Studio for live preview
pnpm dev

# Render a specific composition
pnpm render

# Render all compositions to out/
pnpm render:all
```

## Compositions

| ID                 | Dimensions | Duration | Description                         |
| ------------------ | ---------- | -------- | ----------------------------------- |
| ApiOverview        | 1920x1080  | 15s      | API surface visualization from spec |
| SocialClip         | 1920x1080  | 10s      | Landscape marketing clip            |
| SocialClipSquare   | 1080x1080  | 10s      | Square marketing clip               |
| SocialClipPortrait | 1080x1920  | 10s      | Portrait marketing clip             |
| TerminalDemo       | 1920x1080  | 20s      | CLI walkthrough animation           |

All compositions are defined in `@contractspec/lib.video-gen` -- do not add compositions directly to this package.
