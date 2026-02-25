# @contractspec/tool.bun

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
