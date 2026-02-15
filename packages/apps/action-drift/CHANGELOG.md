# Changelog

## 1.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Patch Changes

- Updated dependencies [a09bafc]
- Updated dependencies [f152678]
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/bundle.workspace@2.0.0

## 0.11.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/bundle.workspace@1.62.0
  - @contractspec/lib.contracts@1.62.0

## 0.10.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/bundle.workspace@1.61.0
  - @contractspec/lib.contracts-spec@1.61.0

## 0.9.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/bundle.workspace@1.60.0
  - @contractspec/lib.contracts-spec@1.60.0

## 0.8.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/bundle.workspace@1.59.0
  - @contractspec/lib.contracts-spec@1.59.0

## 0.7.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/bundle.workspace@1.58.0
  - @contractspec/lib.contracts-spec@1.58.0

## 0.6.0

### Minor Changes

- 4651e06: Add Supabase and voice provider integrations with new runnable examples, and expose these providers across contracts, workspace tooling, and provider factory wiring.
- 11a5a05: feat: improve product intent

### Patch Changes

- Updated dependencies [8ecf3c1]
- Updated dependencies [47c48c2]
- Updated dependencies [a119963]
- Updated dependencies [4651e06]
- Updated dependencies [ad9d10a]
- Updated dependencies [11a5a05]
  - @contractspec/lib.contracts-spec@1.57.0
  - @contractspec/bundle.workspace@1.57.0

## 0.5.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/bundle.workspace@1.56.1
  - @contractspec/lib.contracts-spec@1.56.1

## 0.5.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/bundle.workspace@1.56.0
  - @contractspec/lib.contracts-spec@1.56.0

## 0.4.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/bundle.workspace@1.55.0
  - @contractspec/lib.contracts-spec@1.55.0

## 0.3.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.contracts-spec@1.54.0
  - @contractspec/bundle.workspace@1.54.0

## 0.2.0

### Minor Changes

- 89d3402: Add new ContractSpec PR and drift actions as the primary automation entrypoints.
- f4180d4: fix: performance improvement
- 64d84e1: Add contract-level verification table to impact reports. Defines query and data view contracts for per-contract drift status, surfaces covered, and last verified commit. Reports render the table when contracts data is present; backward compatible when absent.

### Patch Changes

- Updated dependencies [5b371b1]
- Updated dependencies [f4180d4]
- Updated dependencies [64d84e1]
  - @contractspec/lib.contracts-spec@1.53.0
  - @contractspec/bundle.workspace@1.53.0

## 0.1.0

- Initial release.
