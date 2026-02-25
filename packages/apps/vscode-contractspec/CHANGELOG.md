# Changelog

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/bundle.workspace@2.8.0
  - @contractspec/lib.ai-agent@2.8.0
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.contracts-transformers@2.8.0
  - @contractspec/module.ai-chat@2.8.0
  - @contractspec/module.examples@2.8.0
  - @contractspec/module.workspace@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/bundle.workspace@2.7.0
  - @contractspec/lib.ai-agent@2.7.0
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.contracts-transformers@2.7.0
  - @contractspec/module.ai-chat@2.7.0
  - @contractspec/module.examples@2.7.0
  - @contractspec/module.workspace@2.7.0

## 2.6.1

### Patch Changes

- @contractspec/module.ai-chat@2.6.1
- @contractspec/module.examples@2.6.1

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/bundle.workspace@2.6.0
  - @contractspec/lib.ai-agent@2.6.0
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.contracts-transformers@2.6.0
  - @contractspec/module.ai-chat@2.6.0
  - @contractspec/module.examples@2.6.0
  - @contractspec/module.workspace@2.6.0

## 2.5.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.ai-agent@2.5.0
  - @contractspec/lib.contracts-transformers@2.5.0
  - @contractspec/bundle.workspace@2.5.0
  - @contractspec/module.workspace@2.5.0
  - @contractspec/module.examples@2.5.0
  - @contractspec/module.ai-chat@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-transformers@2.4.0
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/bundle.workspace@2.4.0
  - @contractspec/module.workspace@2.4.0
  - @contractspec/module.examples@2.4.0
  - @contractspec/module.ai-chat@2.4.0
  - @contractspec/lib.ai-agent@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-transformers@2.3.0
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/bundle.workspace@2.3.0
  - @contractspec/module.workspace@2.3.0
  - @contractspec/module.examples@2.3.0
  - @contractspec/module.ai-chat@2.3.0
  - @contractspec/lib.ai-agent@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-transformers@2.2.0
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/bundle.workspace@2.2.0
  - @contractspec/module.workspace@2.2.0
  - @contractspec/module.examples@2.2.0
  - @contractspec/module.ai-chat@2.2.0
  - @contractspec/lib.ai-agent@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/bundle.workspace@2.1.1
  - @contractspec/lib.ai-agent@2.1.1
  - @contractspec/lib.contracts-transformers@2.1.1
  - @contractspec/module.ai-chat@2.1.1
  - @contractspec/module.examples@2.1.1
  - @contractspec/module.workspace@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.contracts-transformers@2.1.0
  - @contractspec/bundle.workspace@2.1.0
  - @contractspec/module.workspace@2.1.0
  - @contractspec/module.examples@2.1.0
  - @contractspec/module.ai-chat@2.1.0
  - @contractspec/lib.ai-agent@2.1.0

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
- Updated dependencies [94f3c24]
- Updated dependencies [f152678]
  - @contractspec/lib.contracts-transformers@2.0.0
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/bundle.workspace@2.0.0
  - @contractspec/module.workspace@2.0.0
  - @contractspec/module.examples@2.0.0
  - @contractspec/module.ai-chat@2.0.0
  - @contractspec/lib.ai-agent@2.0.0

## 1.62.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/lib.ai-agent@1.62.0
  - @contractspec/lib.contracts-transformers@1.62.0
  - @contractspec/bundle.workspace@1.62.0
  - @contractspec/module.workspace@1.62.0
  - @contractspec/module.examples@1.62.0
  - @contractspec/module.ai-chat@1.62.0
  - @contractspec/lib.contracts@1.62.0

## 1.61.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.contracts-transformers@1.61.0
  - @contractspec/bundle.workspace@1.61.0
  - @contractspec/module.workspace@1.61.0
  - @contractspec/module.examples@1.61.0
  - @contractspec/module.ai-chat@1.61.0
  - @contractspec/lib.contracts-spec@1.61.0
  - @contractspec/lib.ai-agent@1.61.0

## 1.60.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.60.0
  - @contractspec/bundle.workspace@1.60.0
  - @contractspec/module.workspace@1.60.0
  - @contractspec/module.examples@1.60.0
  - @contractspec/module.ai-chat@1.60.0
  - @contractspec/lib.contracts-spec@1.60.0
  - @contractspec/lib.ai-agent@1.60.0

## 1.59.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.contracts-transformers@1.59.0
  - @contractspec/bundle.workspace@1.59.0
  - @contractspec/module.workspace@1.59.0
  - @contractspec/module.examples@1.59.0
  - @contractspec/module.ai-chat@1.59.0
  - @contractspec/lib.contracts-spec@1.59.0
  - @contractspec/lib.ai-agent@1.59.0

## 1.58.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/lib.contracts-transformers@1.58.0
  - @contractspec/bundle.workspace@1.58.0
  - @contractspec/module.workspace@1.58.0
  - @contractspec/module.examples@1.58.0
  - @contractspec/module.ai-chat@1.58.0
  - @contractspec/lib.contracts-spec@1.58.0
  - @contractspec/lib.ai-agent@1.58.0

## 1.57.0

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
  - @contractspec/bundle.workspace@1.57.0
  - @contractspec/module.workspace@1.57.0
  - @contractspec/module.examples@1.57.0
  - @contractspec/lib.contracts-transformers@1.57.0
  - @contractspec/module.ai-chat@1.57.0
  - @contractspec/lib.ai-agent@1.57.0

## 1.56.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.56.1
  - @contractspec/bundle.workspace@1.56.1
  - @contractspec/module.workspace@1.56.1
  - @contractspec/module.examples@1.56.1
  - @contractspec/module.ai-chat@1.56.1
  - @contractspec/lib.contracts-spec@1.56.1
  - @contractspec/lib.ai-agent@1.56.1

## 1.56.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.56.0
  - @contractspec/bundle.workspace@1.56.0
  - @contractspec/module.workspace@1.56.0
  - @contractspec/module.examples@1.56.0
  - @contractspec/module.ai-chat@1.56.0
  - @contractspec/lib.contracts-spec@1.56.0
  - @contractspec/lib.ai-agent@1.56.0

## 1.55.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.55.0
  - @contractspec/bundle.workspace@1.55.0
  - @contractspec/module.workspace@1.55.0
  - @contractspec/module.examples@1.55.0
  - @contractspec/module.ai-chat@1.55.0
  - @contractspec/lib.contracts-spec@1.55.0
  - @contractspec/lib.ai-agent@1.55.0

## 1.54.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/module.ai-chat@1.54.0
  - @contractspec/lib.contracts-spec@1.54.0
  - @contractspec/bundle.workspace@1.54.0
  - @contractspec/lib.ai-agent@1.54.0
  - @contractspec/lib.contracts-transformers@1.54.0
  - @contractspec/module.examples@1.54.0
  - @contractspec/module.workspace@1.54.0

## 1.53.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- Updated dependencies [5b371b1]
- Updated dependencies [f4180d4]
- Updated dependencies [64d84e1]
  - @contractspec/lib.contracts-spec@1.53.0
  - @contractspec/bundle.workspace@1.53.0
  - @contractspec/module.workspace@1.53.0
  - @contractspec/module.examples@1.53.0
  - @contractspec/lib.ai-agent@1.53.0
  - @contractspec/lib.contracts-transformers@1.53.0
  - @contractspec/module.ai-chat@1.53.0

## 1.52.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.contracts-transformers@1.52.0
  - @contractspec/bundle.workspace@1.52.0
  - @contractspec/module.workspace@1.52.0
  - @contractspec/module.examples@1.52.0
  - @contractspec/module.ai-chat@1.52.0
  - @contractspec/lib.contracts-spec@1.52.0
  - @contractspec/lib.ai-agent@1.52.0

## 1.51.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [23e46e9]
- Updated dependencies [ad1f852]
- Updated dependencies [e6faefb]
  - @contractspec/lib.contracts-spec@1.51.0
  - @contractspec/lib.contracts-transformers@1.51.0
  - @contractspec/bundle.workspace@1.51.0
  - @contractspec/module.workspace@1.51.0
  - @contractspec/module.examples@1.51.0
  - @contractspec/module.ai-chat@1.51.0
  - @contractspec/lib.ai-agent@1.51.0

## 1.50.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
- Updated dependencies [81a703b]
  - @contractspec/bundle.workspace@1.50.0
  - @contractspec/lib.contracts-spec@1.50.0
  - @contractspec/lib.ai-agent@1.50.0
  - @contractspec/lib.contracts-transformers@1.50.0
  - @contractspec/module.ai-chat@1.50.0
  - @contractspec/module.examples@1.50.0
  - @contractspec/module.workspace@1.50.0

## 1.49.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.contracts-transformers@1.49.0
  - @contractspec/bundle.workspace@1.49.0
  - @contractspec/module.workspace@1.49.0
  - @contractspec/module.examples@1.49.0
  - @contractspec/module.ai-chat@1.49.0
  - @contractspec/lib.contracts-spec@1.49.0
  - @contractspec/lib.ai-agent@1.49.0

## 1.48.2

### Patch Changes

- @contractspec/module.examples@1.48.2

## 1.48.1

### Patch Changes

- Updated dependencies [c560ee7]
  - @contractspec/bundle.workspace@1.48.1
  - @contractspec/lib.contracts-spec@1.48.1
  - @contractspec/module.ai-chat@1.48.1
  - @contractspec/lib.ai-agent@1.48.1
  - @contractspec/lib.contracts-transformers@1.48.1
  - @contractspec/module.examples@1.48.1
  - @contractspec/module.workspace@1.48.1

## 1.48.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.contracts-transformers@1.48.0
  - @contractspec/bundle.workspace@1.48.0
  - @contractspec/module.workspace@1.48.0
  - @contractspec/module.examples@1.48.0
  - @contractspec/module.ai-chat@1.48.0
  - @contractspec/lib.contracts-spec@1.48.0
  - @contractspec/lib.ai-agent@1.48.0

## 1.47.0

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
  - @contractspec/lib.contracts-transformers@1.47.0
  - @contractspec/bundle.workspace@1.47.0
  - @contractspec/module.workspace@1.47.0
  - @contractspec/module.examples@1.47.0
  - @contractspec/module.ai-chat@1.47.0
  - @contractspec/lib.contracts-spec@1.47.0
  - @contractspec/lib.ai-agent@1.47.0

## 1.46.2

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.contracts-transformers@1.46.2
  - @contractspec/bundle.workspace@1.46.2
  - @contractspec/module.workspace@1.46.2
  - @contractspec/module.examples@1.46.2
  - @contractspec/lib.contracts-spec@1.46.2
  - @contractspec/lib.ai-agent@1.46.2

## 1.46.1

### Patch Changes

- 2d8a72b: fix: mcp for presentation
- Updated dependencies [2d8a72b]
  - @contractspec/lib.contracts-transformers@1.46.1
  - @contractspec/bundle.workspace@1.46.1
  - @contractspec/module.workspace@1.46.1
  - @contractspec/module.examples@1.46.1
  - @contractspec/lib.contracts-spec@1.46.1
  - @contractspec/lib.ai-agent@1.46.1

## 1.46.0

### Minor Changes

- 07cb19b: feat: feat: cleaude code & opencode integrations

### Patch Changes

- Updated dependencies [07cb19b]
  - @contractspec/lib.contracts-transformers@1.46.0
  - @contractspec/bundle.workspace@1.46.0
  - @contractspec/module.workspace@1.46.0
  - @contractspec/module.examples@1.46.0
  - @contractspec/lib.contracts-spec@1.46.0
  - @contractspec/lib.ai-agent@1.46.0

## 1.45.6

### Patch Changes

- a913074: feat: improve ai agents rules management"
- Updated dependencies [a913074]
  - @contractspec/lib.contracts-transformers@1.45.6
  - @contractspec/bundle.workspace@1.45.6
  - @contractspec/module.workspace@1.45.6
  - @contractspec/module.examples@1.45.6
  - @contractspec/lib.contracts-spec@1.45.6

## 1.45.5

### Patch Changes

- 9ddd7fa: feat: improve versioning
- Updated dependencies [9ddd7fa]
  - @contractspec/lib.contracts-transformers@1.45.5
  - @contractspec/bundle.workspace@1.45.5
  - @contractspec/module.workspace@1.45.5
  - @contractspec/module.examples@1.45.5
  - @contractspec/lib.contracts-spec@1.45.5

## 1.45.4

### Patch Changes

- fix: github action
- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.45.4
  - @contractspec/bundle.workspace@1.45.4
  - @contractspec/module.workspace@1.45.4
  - @contractspec/module.examples@1.45.4
  - @contractspec/lib.contracts-spec@1.45.4

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management
- Updated dependencies [e74ea9e]
  - @contractspec/lib.contracts-transformers@1.45.3
  - @contractspec/bundle.workspace@1.45.3
  - @contractspec/module.workspace@1.45.3
  - @contractspec/module.examples@1.45.3
  - @contractspec/lib.contracts-spec@1.45.3

## 1.45.2

### Patch Changes

- 39ca241: code cleaning
- Updated dependencies [39ca241]
  - @contractspec/lib.contracts-transformers@1.45.2
  - @contractspec/bundle.workspace@1.45.2
  - @contractspec/module.workspace@1.45.2
  - @contractspec/module.examples@1.45.2
  - @contractspec/lib.contracts-spec@1.45.2

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts
- Updated dependencies
  - @contractspec/lib.contracts-transformers@1.45.1
  - @contractspec/bundle.workspace@1.45.1
  - @contractspec/module.workspace@1.45.1
  - @contractspec/module.examples@1.45.1
  - @contractspec/lib.contracts-spec@1.45.1

## 1.45.0

### Minor Changes

- e73ca1d: feat: improve app config and examples contracts
  feat: Contract layers support (features, examples, app-configs)

  ### New CLI Commands
  - `contractspec list layers` - List all contract layers with filtering

  ### Enhanced Commands
  - `contractspec ci` - New `layers` check category validates features/examples/config
  - `contractspec doctor` - New `layers` health checks
  - `contractspec integrity` - Now shows layer statistics

  ### New APIs
  - `discoverLayers()` - Scan workspace for all layer files
  - `scanExampleSource()` - Parse ExampleSpec from source code
  - `isExampleFile()` - Check if file is an example spec

### Patch Changes

- Updated dependencies [e73ca1d]
  - @contractspec/lib.contracts-transformers@1.45.0
  - @contractspec/bundle.workspace@1.45.0
  - @contractspec/module.workspace@1.45.0
  - @contractspec/module.examples@1.45.0
  - @contractspec/lib.contracts-spec@1.45.0

## 1.44.1

### Patch Changes

- 3c594fb: fix
- Updated dependencies [3c594fb]
  - @contractspec/lib.contracts-transformers@1.44.1
  - @contractspec/bundle.workspace@1.44.1
  - @contractspec/module.workspace@1.44.1
  - @contractspec/module.examples@1.44.1
  - @contractspec/lib.contracts-spec@1.44.1

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

### Patch Changes

- Updated dependencies [5f3a868]
  - @contractspec/lib.contracts-transformers@1.44.0
  - @contractspec/bundle.workspace@1.44.0
  - @contractspec/module.workspace@1.44.0
  - @contractspec/module.examples@1.44.0
  - @contractspec/lib.contracts-spec@1.44.0

## 1.43.4

### Patch Changes

- 9216062: fix: cross-platform compatibility
- Updated dependencies [9216062]
  - @contractspec/bundle.workspace@1.43.4
  - @contractspec/module.workspace@1.43.4
  - @contractspec/module.examples@1.43.4
  - @contractspec/lib.contracts-transformers@1.43.4
  - @contractspec/lib.contracts-spec@1.43.4

## 1.43.3

### Patch Changes

- 24d9759: improve documentation
- Updated dependencies [24d9759]
  - @contractspec/bundle.workspace@1.43.3
  - @contractspec/module.workspace@1.43.3
  - @contractspec/module.examples@1.43.3
  - @contractspec/lib.contracts-transformers@1.43.3
  - @contractspec/lib.contracts-spec@1.43.3

## 1.43.2

### Patch Changes

- e147271: fix: improve stability
- Updated dependencies [e147271]
  - @contractspec/bundle.workspace@1.43.2
  - @contractspec/module.workspace@1.43.2
  - @contractspec/module.examples@1.43.2
  - @contractspec/lib.contracts-transformers@1.43.2
  - @contractspec/lib.contracts-spec@1.43.2

## 1.43.1

### Patch Changes

- Updated dependencies [f28fdad]
  - @contractspec/lib.contracts-spec@1.43.1
  - @contractspec/bundle.workspace@1.43.1
  - @contractspec/lib.contracts-transformers@1.43.1
  - @contractspec/module.workspace@1.43.1
  - @contractspec/module.examples@1.43.1

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

### Patch Changes

- Updated dependencies [042d072]
  - @contractspec/bundle.workspace@1.43.0
  - @contractspec/module.workspace@1.43.0
  - @contractspec/module.examples@1.43.0
  - @contractspec/lib.contracts-transformers@1.43.0
  - @contractspec/lib.contracts-spec@1.43.0

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server
- Updated dependencies [1e6a0f1]
  - @contractspec/bundle.workspace@1.42.10
  - @contractspec/module.workspace@1.42.10
  - @contractspec/module.examples@1.42.10
  - @contractspec/lib.contracts-transformers@1.42.10
  - @contractspec/lib.contracts-spec@1.42.10

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry
- Updated dependencies [9281db7]
  - @contractspec/bundle.workspace@1.42.9
  - @contractspec/module.workspace@1.42.9
  - @contractspec/module.examples@1.42.9
  - @contractspec/lib.contracts-transformers@1.42.9
  - @contractspec/lib.contracts-spec@1.42.9

## 1.42.8

### Patch Changes

- e07b5ac: fix
- Updated dependencies [e07b5ac]
  - @contractspec/bundle.workspace@1.42.8
  - @contractspec/module.workspace@1.42.8
  - @contractspec/module.examples@1.42.8
  - @contractspec/lib.contracts-transformers@1.42.8
  - @contractspec/lib.contracts-spec@1.42.8

## 1.42.7

### Patch Changes

- e9b575d: fix release
- Updated dependencies [e9b575d]
  - @contractspec/bundle.workspace@1.42.7
  - @contractspec/module.workspace@1.42.7
  - @contractspec/module.examples@1.42.7
  - @contractspec/lib.contracts-transformers@1.42.7
  - @contractspec/lib.contracts-spec@1.42.7

## 1.42.6

### Patch Changes

- 1500242: fix tooling
- Updated dependencies [1500242]
  - @contractspec/bundle.workspace@1.42.6
  - @contractspec/module.workspace@1.42.6
  - @contractspec/module.examples@1.42.6
  - @contractspec/lib.contracts-transformers@1.42.6
  - @contractspec/lib.contracts-spec@1.42.6

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @contractspec/bundle.workspace@1.42.5
  - @contractspec/module.workspace@1.42.5
  - @contractspec/module.examples@1.42.5
  - @contractspec/lib.contracts-transformers@1.42.5
  - @contractspec/lib.contracts-spec@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @contractspec/bundle.workspace@1.42.4
  - @contractspec/module.workspace@1.42.4
  - @contractspec/module.examples@1.42.4
  - @contractspec/lib.contracts-transformers@1.42.4
  - @contractspec/lib.contracts-spec@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @contractspec/lib.contracts-transformers@1.42.3
  - @contractspec/bundle.workspace@1.42.3
  - @contractspec/lib.contracts-spec@1.42.3
  - @contractspec/module.examples@1.42.3
  - @contractspec/module.workspace@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @contractspec/bundle.workspace@1.42.2
  - @contractspec/lib.contracts-spec@1.42.2
  - @contractspec/lib.contracts-transformers@1.42.2
  - @contractspec/module.examples@1.42.2
  - @contractspec/module.workspace@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @contractspec/bundle.workspace@1.42.1
  - @contractspec/module.workspace@1.42.1
  - @contractspec/module.examples@1.42.1
  - @contractspec/lib.contracts-transformers@1.42.1
  - @contractspec/lib.contracts-spec@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @contractspec/bundle.workspace@1.42.0
  - @contractspec/lib.contracts-spec@1.42.0
  - @contractspec/lib.contracts-transformers@1.42.0
  - @contractspec/module.examples@1.42.0
  - @contractspec/module.workspace@1.42.0

All notable changes to the ContractSpec VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - Unreleased

### Added

- **Validation Commands**
  - `ContractSpec: Validate Current Spec` - Validate the currently open spec file
  - `ContractSpec: Validate All Specs in Workspace` - Validate all spec files in the workspace

- **Build/Scaffold Commands**
  - `ContractSpec: Build/Scaffold from Current Spec` - Generate handler/component skeletons from specs

- **Navigation Commands**
  - `ContractSpec: List All Specs` - Show all specs in the workspace with quick navigation
  - `ContractSpec: Analyze Spec Dependencies` - Visualize spec dependencies and detect cycles
  - `ContractSpec: Search ContractSpec Docs (MCP)` - Search documentation via MCP

- **Real-time Diagnostics**
  - Automatic validation on file open (configurable)
  - Automatic validation on file save (configurable)
  - Inline error and warning markers

- **Code Snippets**
  - `contractspec-command` - Create a new command spec
  - `contractspec-query` - Create a new query spec
  - `contractspec-event` - Create a new event spec
  - `contractspec-docblock` - Create a new DocBlock
  - `contractspec-telemetry` - Create a new TelemetrySpec
  - `contractspec-presentation` - Create a new Presentation spec

- **Telemetry**
  - Hybrid telemetry model (direct PostHog or via API)
  - Respects VS Code telemetry settings
  - No PII collection

- **Configuration Options**
  - `contractspec.api.baseUrl` - Base URL for ContractSpec API
  - `contractspec.telemetry.posthogHost` - PostHog host URL
  - `contractspec.telemetry.posthogProjectKey` - PostHog project key
  - `contractspec.validation.onSave` - Toggle validation on save
  - `contractspec.validation.onOpen` - Toggle validation on open

### Technical

- Uses `@contractspec/bundle.workspace` for workspace services
- Uses `@contractspec/module.workspace` for analysis and templates
- Works without requiring CLI installation
- Bundled with esbuild for fast load times
