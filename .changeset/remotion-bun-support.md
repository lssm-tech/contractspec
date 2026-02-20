---
'@contractspec/app.video-studio': patch
'@contractspec/lib.video-gen': patch
---

Switch Remotion CLI from `npx remotion` to `bunx remotionb` for native Bun runtime support.

- update video-studio scripts (`dev`, `render`, `render:all`) to use `bunx remotionb`
- correct documentation that incorrectly claimed Remotion does not run on Bun
- document known Bun caveats (`lazyComponent` disabled, SSR scripts may not auto-quit)
