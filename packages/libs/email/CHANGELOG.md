# @contractspec/lib.email

## 3.7.11

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.logger@3.7.11

## 3.7.10

### Patch Changes

- chore: stability & release
- Updated dependencies
  - @contractspec/lib.logger@3.7.10

## 3.7.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.logger@3.7.9

## 3.7.8

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.logger@3.7.8

## 3.7.7

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.logger@3.7.7

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.logger@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.logger@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.logger@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.logger@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
  - @contractspec/lib.logger@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.logger@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.logger@3.7.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [ea320ea]
  - @contractspec/lib.logger@3.6.0

## 3.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [693eedd]
  - @contractspec/lib.logger@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
  - @contractspec/lib.logger@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.logger@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.logger@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.logger@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.logger@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.logger@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.logger@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.logger@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
  - @contractspec/lib.logger@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.logger@3.3.0

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.logger@3.2.0

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [28987eb]
  - @contractspec/lib.logger@3.1.0

## 3.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

### Patch Changes

- Updated dependencies [b781ce6]
  - @contractspec/lib.logger@3.0.0

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@2.7.0

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.logger@2.6.0

## 2.5.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [c83c323]
  - @contractspec/lib.logger@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.logger@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@2.2.0

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [362fbac]
  - @contractspec/lib.logger@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Patch Changes

- Updated dependencies [a09bafc]
  - @contractspec/lib.logger@2.0.0

## 1.16.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
  - @contractspec/lib.logger@1.62.0

## 1.15.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.logger@1.61.0

## 1.14.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@1.60.0

## 1.13.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.logger@1.59.0

## 1.12.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
  - @contractspec/lib.logger@1.58.0

## 1.11.0

### Minor Changes

- 11a5a05: feat: improve product intent

### Patch Changes

- Updated dependencies [11a5a05]
  - @contractspec/lib.logger@1.57.0

## 1.10.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.logger@1.56.1

## 1.10.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@1.56.0

## 1.9.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.logger@1.55.0

## 1.8.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.logger@1.54.0

## 1.7.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- Updated dependencies [f4180d4]
  - @contractspec/lib.logger@1.53.0

## 1.6.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.logger@1.52.0

## 1.5.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [e6faefb]
  - @contractspec/lib.logger@1.51.0

## 1.4.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.logger@1.50.0

## 1.3.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.logger@1.49.0

## 1.2.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.logger@1.48.0

## 1.1.0

### Minor Changes

- caf8701: feat: add cli vibe command to run workflow
- c69b849: feat: add api web services (mcp & website)
- 42b8d78: feat: add cli `contractspec vibe` workflow to simplify usage
- fd38e85: feat: auto-fix contractspec issues

### Patch Changes

- e7ded36: feat: improve stability (adding ts-morph)
- c231a8b: test: improve workspace stability
- Updated dependencies [e7ded36]
- Updated dependencies [caf8701]
- Updated dependencies [c69b849]
- Updated dependencies [c231a8b]
- Updated dependencies [42b8d78]
- Updated dependencies [fd38e85]
  - @contractspec/lib.logger@1.47.0

## 1.0.1

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.logger@1.46.2
