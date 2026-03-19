# @contractspec/tool.bun

## 3.7.5

### Patch Changes

- ecf195a: fix: release security

## 3.7.4

### Patch Changes

- fix: release security

## 3.7.3

### Patch Changes

- fix: release

## 3.7.2

### Patch Changes

- 8cd229b: fix: release

## 3.7.1

### Patch Changes

- 552cd92: Add help output to `contractspec-bun-build` and support `.web` / `.native`
  platform variants in generated exports and build outputs.
- 5eb8626: fix: package exports

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

## 3.5.5

### Patch Changes

- 693eedd: chore: improve ai models

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming

## 3.5.3

### Patch Changes

- b0b4da6: fix: release

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- c527a4e: Fix jsxDEV runtime error in ai-chat module
  - Add bunfig.toml to ai-chat with `jsx = "react-jsx"` to work around Bun v1.3+ regression (oven-sh/bun#23959)
  - Pass NODE_ENV=production when spawning bun build in runTranspile for monorepo-wide safeguard

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

## 3.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

## 2.9.0

### Minor Changes

- fix: minimatch version

## 2.8.0

### Minor Changes

- fix: tarball packages

## 2.7.0

### Minor Changes

- chore: release improvements

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

## 2.5.0

### Minor Changes

- c83c323: feat: major change to content generation

## 2.4.0

### Minor Changes

- chore: improve documentation

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Patch Changes

- 94f3c24: perf: reduce import-time memory usage by slimming root barrels and moving heavy runtime surfaces to explicit subpath entrypoints.

  Breaking changes:
  - `@contractspec/lib.contracts` root exports are now intentionally minimal; workflow/tests/app-config/regenerator/telemetry/experiments and other heavy modules must be imported from their dedicated subpaths.
  - `@contractspec/lib.ai-agent` root exports are reduced to lightweight surfaces; runtime agent APIs should be imported from package subpaths.

  Additional optimizations:
  - add schema-level memoization/caching for zod/json-schema conversion paths and scalar factory reuse in `@contractspec/lib.schema`.
  - lower default build memory pressure in `@contractspec/tool.bun` by preferring bun-only dev targets and disabling declaration maps by default for type builds.

## 1.61.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

## 1.60.0

### Minor Changes

- 374fd71: fix: publishing

## 1.59.0

### Minor Changes

- fix: publish with bun

## 1.58.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

## 1.57.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.
