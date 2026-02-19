# @contractspec/example.in-app-docs

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.example-shared-ui@2.4.0
  - @contractspec/lib.contracts-spec@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.example-shared-ui@2.3.0
  - @contractspec/lib.contracts-spec@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.example-shared-ui@2.2.0
  - @contractspec/lib.contracts-spec@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/lib.example-shared-ui@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.example-shared-ui@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Patch Changes

- 7f3203a: fix: make workspace test runs resilient when packages have no tests

  Updates package test scripts to pass cleanly when no matching test files exist:
  - Uses `bun test --pass-with-no-tests` in Bun-based packages that currently ship without test files.
  - Uses `jest --passWithNoTests` for the UI kit web package.
  - Adds `.vscode-test.mjs` for `vscode-contractspec` so VS Code extension test runs have an explicit config and stop failing on missing default configuration.

  This keeps `turbo run test` deterministic across the monorepo while preserving existing test execution behavior where tests are present.

- Updated dependencies [a09bafc]
- Updated dependencies [f152678]
- Updated dependencies [7f3203a]
  - @contractspec/lib.example-shared-ui@2.0.0
  - @contractspec/lib.contracts-spec@2.0.0

## 1.9.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/lib.example-shared-ui@1.16.0
  - @contractspec/lib.contracts@1.62.0

## 1.8.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.example-shared-ui@1.15.0
  - @contractspec/lib.contracts-spec@1.61.0

## 1.7.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.example-shared-ui@1.14.0
  - @contractspec/lib.contracts-spec@1.60.0

## 1.6.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.example-shared-ui@1.13.0
  - @contractspec/lib.contracts-spec@1.59.0

## 1.5.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/lib.example-shared-ui@1.12.0
  - @contractspec/lib.contracts-spec@1.58.0

## 1.4.0

### Minor Changes

- 11a5a05: feat: improve product intent

### Patch Changes

- Updated dependencies [8ecf3c1]
- Updated dependencies [47c48c2]
- Updated dependencies [a119963]
- Updated dependencies [4651e06]
- Updated dependencies [ad9d10a]
- Updated dependencies [11a5a05]
  - @contractspec/lib.contracts-spec@1.57.0
  - @contractspec/lib.example-shared-ui@1.11.0

## 1.3.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.example-shared-ui@1.10.1
  - @contractspec/lib.contracts-spec@1.56.1

## 1.3.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.example-shared-ui@1.10.0
  - @contractspec/lib.contracts-spec@1.56.0

## 1.2.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.example-shared-ui@1.9.0
  - @contractspec/lib.contracts-spec@1.55.0

## 1.1.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.example-shared-ui@1.8.0
  - @contractspec/lib.contracts-spec@1.54.0
