# contractspec-example-minimal

## 2.8.9

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.schema@3.7.14

## 2.8.8

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.schema@3.7.13

## 2.8.7

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.schema@3.7.12

## 2.8.6

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.schema@3.7.11

## 2.8.5

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1

## 2.8.4

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.schema@3.7.10

## 2.8.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.schema@3.7.9

## 2.8.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.schema@3.7.8

## 2.8.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.schema@3.7.7

## 2.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.6

## 2.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-spec@3.7.5

## 2.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.4

## 2.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.3

## 2.7.2

### Patch Changes

- 8cd229b: fix: release
- 04bc555: Improve contract integrity, example validation, onboarding docs, doctor safety,
  release verification, packaged smoke testing, and security workflow coverage.
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-spec@3.7.2

## 2.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-spec@3.7.1

## 2.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-spec@3.7.0

## 2.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0

## 2.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5

## 2.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-spec@3.5.4

## 2.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-spec@3.5.3

## 2.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-spec@3.5.2

## 2.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.contracts-spec@3.5.1

## 2.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-spec@3.5.0

## 2.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-spec@3.4.3

## 2.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-spec@3.4.2

## 2.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-spec@3.4.1

## 2.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-spec@3.4.0

## 2.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.contracts-spec@3.3.0

## 2.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-spec@3.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-spec@3.1.1

## 2.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0

## 2.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

### Patch Changes

- Updated dependencies [7cbdb7f]
- Updated dependencies [c608804]
- Updated dependencies [e3bc858]
- Updated dependencies [b19ae0a]
- Updated dependencies [aa4a9c9]
- Updated dependencies [b781ce6]
  - @contractspec/lib.contracts-spec@3.0.0

## 1.9.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-spec@2.10.0

## 1.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.9.0

## 1.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.8.0

## 1.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.7.0

## 1.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.contracts-spec@2.6.0

## 1.5.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0

## 1.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.4.0

## 1.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-spec@2.3.0

## 1.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.2.0

## 1.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1

## 1.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0

## 1.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Patch Changes

- Updated dependencies [a09bafc]
- Updated dependencies [f152678]
  - @contractspec/lib.contracts-spec@2.0.0

## 0.15.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

## 0.14.0

### Minor Changes

- 374fd71: fix: publishing

## 0.13.0

### Minor Changes

- fix: publish with bun

## 0.12.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

## 0.11.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

## 0.10.0

### Minor Changes

- 11a5a05: feat: improve product intent

## 0.9.1

### Patch Changes

- fix: improve publish config

## 0.9.0

### Minor Changes

- fix: release

## 0.8.0

### Minor Changes

- fix: unpublished packages

## 0.7.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

## 0.6.0

### Minor Changes

- f4180d4: fix: performance improvement

## 0.5.0

### Minor Changes

- d93e6a9: fix: improve website

## 0.4.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

## 0.3.0

### Minor Changes

- 5325d6b: feat: improve seo

## 0.2.0

### Minor Changes

- cafd041: fix: impact report comments within github action
