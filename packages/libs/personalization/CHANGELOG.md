# @contractspec/lib.personalization

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.overlay-engine@2.3.0
  - @contractspec/lib.knowledge@2.3.0
  - @contractspec/lib.schema@2.3.0
  - @contractspec/lib.bus@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.overlay-engine@2.2.0
  - @contractspec/lib.knowledge@2.2.0
  - @contractspec/lib.schema@2.2.0
  - @contractspec/lib.bus@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/lib.bus@2.1.1
  - @contractspec/lib.knowledge@2.1.1
  - @contractspec/lib.overlay-engine@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.overlay-engine@2.1.0
  - @contractspec/lib.knowledge@2.1.0
  - @contractspec/lib.schema@2.1.0
  - @contractspec/lib.bus@2.1.0

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
- Updated dependencies [7f3203a]
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/lib.overlay-engine@2.0.0
  - @contractspec/lib.knowledge@2.0.0
  - @contractspec/lib.schema@2.0.0
  - @contractspec/lib.bus@2.0.0

## 1.62.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/lib.overlay-engine@1.62.0
  - @contractspec/lib.contracts@1.62.0
  - @contractspec/lib.knowledge@1.62.0
  - @contractspec/lib.schema@1.62.0
  - @contractspec/lib.bus@1.62.0

## 1.61.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.overlay-engine@1.61.0
  - @contractspec/lib.contracts-spec@1.61.0
  - @contractspec/lib.knowledge@1.61.0
  - @contractspec/lib.schema@1.61.0
  - @contractspec/lib.bus@1.61.0

## 1.60.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.overlay-engine@1.60.0
  - @contractspec/lib.contracts-spec@1.60.0
  - @contractspec/lib.knowledge@1.60.0
  - @contractspec/lib.schema@1.60.0
  - @contractspec/lib.bus@1.60.0

## 1.59.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.overlay-engine@1.59.0
  - @contractspec/lib.contracts-spec@1.59.0
  - @contractspec/lib.knowledge@1.59.0
  - @contractspec/lib.schema@1.59.0
  - @contractspec/lib.bus@1.59.0

## 1.58.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/lib.overlay-engine@1.58.0
  - @contractspec/lib.contracts-spec@1.58.0
  - @contractspec/lib.knowledge@1.58.0
  - @contractspec/lib.schema@1.58.0
  - @contractspec/lib.bus@1.58.0

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
  - @contractspec/lib.overlay-engine@1.57.0
  - @contractspec/lib.knowledge@1.57.0
  - @contractspec/lib.schema@1.57.0
  - @contractspec/lib.bus@1.57.0

## 1.56.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.overlay-engine@1.56.1
  - @contractspec/lib.contracts-spec@1.56.1
  - @contractspec/lib.knowledge@1.56.1
  - @contractspec/lib.schema@1.56.1
  - @contractspec/lib.bus@1.56.1

## 1.56.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.overlay-engine@1.56.0
  - @contractspec/lib.contracts-spec@1.56.0
  - @contractspec/lib.knowledge@1.56.0
  - @contractspec/lib.schema@1.56.0
  - @contractspec/lib.bus@1.56.0

## 1.55.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.overlay-engine@1.55.0
  - @contractspec/lib.contracts-spec@1.55.0
  - @contractspec/lib.knowledge@1.55.0
  - @contractspec/lib.schema@1.55.0
  - @contractspec/lib.bus@1.55.0

## 1.54.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.contracts-spec@1.54.0
  - @contractspec/lib.bus@1.54.0
  - @contractspec/lib.knowledge@1.54.0
  - @contractspec/lib.overlay-engine@1.54.0
  - @contractspec/lib.schema@1.54.0

## 1.53.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- Updated dependencies [5b371b1]
- Updated dependencies [f4180d4]
- Updated dependencies [64d84e1]
  - @contractspec/lib.contracts-spec@1.53.0
  - @contractspec/lib.schema@1.53.0
  - @contractspec/lib.bus@1.53.0
  - @contractspec/lib.knowledge@1.53.0
  - @contractspec/lib.overlay-engine@1.53.0

## 1.52.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.overlay-engine@1.52.0
  - @contractspec/lib.contracts-spec@1.52.0
  - @contractspec/lib.knowledge@1.52.0
  - @contractspec/lib.schema@1.52.0
  - @contractspec/lib.bus@1.52.0

## 1.51.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [23e46e9]
- Updated dependencies [ad1f852]
- Updated dependencies [e6faefb]
  - @contractspec/lib.contracts-spec@1.51.0
  - @contractspec/lib.overlay-engine@1.51.0
  - @contractspec/lib.knowledge@1.51.0
  - @contractspec/lib.schema@1.51.0
  - @contractspec/lib.bus@1.51.0

## 1.50.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.contracts-spec@1.50.0
  - @contractspec/lib.bus@1.50.0
  - @contractspec/lib.knowledge@1.50.0
  - @contractspec/lib.overlay-engine@1.50.0
  - @contractspec/lib.schema@1.50.0

## 1.49.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.overlay-engine@1.49.0
  - @contractspec/lib.contracts-spec@1.49.0
  - @contractspec/lib.knowledge@1.49.0
  - @contractspec/lib.schema@1.49.0
  - @contractspec/lib.bus@1.49.0

## 1.48.1

### Patch Changes

- Updated dependencies [c560ee7]
  - @contractspec/lib.contracts-spec@1.48.1
  - @contractspec/lib.bus@1.48.1
  - @contractspec/lib.knowledge@1.48.1
  - @contractspec/lib.overlay-engine@1.48.1

## 1.48.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.overlay-engine@1.48.0
  - @contractspec/lib.contracts-spec@1.48.0
  - @contractspec/lib.knowledge@1.48.0
  - @contractspec/lib.schema@1.48.0
  - @contractspec/lib.bus@1.48.0

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
  - @contractspec/lib.overlay-engine@1.47.0
  - @contractspec/lib.contracts-spec@1.47.0
  - @contractspec/lib.knowledge@1.47.0
  - @contractspec/lib.schema@1.47.0
  - @contractspec/lib.bus@1.47.0

## 1.46.2

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.overlay-engine@1.46.2
  - @contractspec/lib.contracts-spec@1.46.2
  - @contractspec/lib.knowledge@1.46.2
  - @contractspec/lib.schema@1.46.2
  - @contractspec/lib.bus@1.46.2

## 1.46.1

### Patch Changes

- 2d8a72b: fix: mcp for presentation
- Updated dependencies [2d8a72b]
  - @contractspec/lib.overlay-engine@1.46.1
  - @contractspec/lib.contracts-spec@1.46.1
  - @contractspec/lib.knowledge@1.46.1
  - @contractspec/lib.schema@1.46.1
  - @contractspec/lib.bus@1.46.1

## 1.46.0

### Minor Changes

- 07cb19b: feat: feat: cleaude code & opencode integrations

### Patch Changes

- Updated dependencies [07cb19b]
  - @contractspec/lib.overlay-engine@1.46.0
  - @contractspec/lib.contracts-spec@1.46.0
  - @contractspec/lib.knowledge@1.46.0
  - @contractspec/lib.schema@1.46.0
  - @contractspec/lib.bus@1.46.0

## 1.45.6

### Patch Changes

- a913074: feat: improve ai agents rules management"
- Updated dependencies [a913074]
  - @contractspec/lib.overlay-engine@1.45.6
  - @contractspec/lib.contracts-spec@1.45.6
  - @contractspec/lib.knowledge@1.45.6
  - @contractspec/lib.schema@1.45.6
  - @contractspec/lib.bus@1.45.6

## 1.45.5

### Patch Changes

- 9ddd7fa: feat: improve versioning
- Updated dependencies [9ddd7fa]
  - @contractspec/lib.overlay-engine@1.45.5
  - @contractspec/lib.contracts-spec@1.45.5
  - @contractspec/lib.knowledge@1.45.5
  - @contractspec/lib.schema@1.45.5
  - @contractspec/lib.bus@1.45.5

## 1.45.4

### Patch Changes

- fix: github action
- Updated dependencies
  - @contractspec/lib.overlay-engine@1.45.4
  - @contractspec/lib.contracts-spec@1.45.4
  - @contractspec/lib.knowledge@1.45.4
  - @contractspec/lib.schema@1.45.4
  - @contractspec/lib.bus@1.45.4

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management
- Updated dependencies [e74ea9e]
  - @contractspec/lib.overlay-engine@1.45.3
  - @contractspec/lib.contracts-spec@1.45.3
  - @contractspec/lib.knowledge@1.45.3
  - @contractspec/lib.schema@1.45.3
  - @contractspec/lib.bus@1.45.3

## 1.45.2

### Patch Changes

- 39ca241: code cleaning
- Updated dependencies [39ca241]
  - @contractspec/lib.overlay-engine@1.45.2
  - @contractspec/lib.contracts-spec@1.45.2
  - @contractspec/lib.knowledge@1.45.2
  - @contractspec/lib.schema@1.45.2
  - @contractspec/lib.bus@1.45.2

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts
- Updated dependencies
  - @contractspec/lib.overlay-engine@1.45.1
  - @contractspec/lib.contracts-spec@1.45.1
  - @contractspec/lib.knowledge@1.45.1
  - @contractspec/lib.schema@1.45.1
  - @contractspec/lib.bus@1.45.1

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
  - @contractspec/lib.overlay-engine@1.45.0
  - @contractspec/lib.contracts-spec@1.45.0
  - @contractspec/lib.knowledge@1.45.0
  - @contractspec/lib.schema@1.45.0
  - @contractspec/lib.bus@1.45.0

## 1.44.1

### Patch Changes

- 3c594fb: fix
- Updated dependencies [3c594fb]
  - @contractspec/lib.overlay-engine@1.44.1
  - @contractspec/lib.contracts-spec@1.44.1
  - @contractspec/lib.knowledge@1.44.1
  - @contractspec/lib.schema@1.44.1
  - @contractspec/lib.bus@1.44.1

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

### Patch Changes

- Updated dependencies [5f3a868]
  - @contractspec/lib.overlay-engine@1.44.0
  - @contractspec/lib.contracts-spec@1.44.0
  - @contractspec/lib.knowledge@1.44.0
  - @contractspec/lib.schema@1.44.0
  - @contractspec/lib.bus@1.44.0

## 1.43.4

### Patch Changes

- 9216062: fix: cross-platform compatibility
- Updated dependencies [9216062]
  - @contractspec/lib.overlay-engine@1.43.4
  - @contractspec/lib.contracts-spec@1.43.4
  - @contractspec/lib.knowledge@1.43.4
  - @contractspec/lib.schema@1.43.3
  - @contractspec/lib.bus@1.43.4

## 1.43.3

### Patch Changes

- 24d9759: improve documentation
- Updated dependencies [24d9759]
  - @contractspec/lib.overlay-engine@1.43.3
  - @contractspec/lib.contracts-spec@1.43.3
  - @contractspec/lib.knowledge@1.43.3
  - @contractspec/lib.schema@1.43.2
  - @contractspec/lib.bus@1.43.3

## 1.43.2

### Patch Changes

- e147271: fix: improve stability
- Updated dependencies [e147271]
  - @contractspec/lib.overlay-engine@1.43.2
  - @contractspec/lib.contracts-spec@1.43.2
  - @contractspec/lib.knowledge@1.43.2
  - @contractspec/lib.bus@1.43.2
  - @contractspec/lib.schema@1.43.1

## 1.43.1

### Patch Changes

- Updated dependencies [f28fdad]
  - @contractspec/lib.contracts-spec@1.43.1
  - @contractspec/lib.bus@1.43.1
  - @contractspec/lib.knowledge@1.43.1
  - @contractspec/lib.overlay-engine@1.43.1

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

### Patch Changes

- Updated dependencies [042d072]
  - @contractspec/lib.overlay-engine@1.43.0
  - @contractspec/lib.contracts-spec@1.43.0
  - @contractspec/lib.knowledge@1.43.0
  - @contractspec/lib.schema@1.43.0
  - @contractspec/lib.bus@1.43.0

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server
- Updated dependencies [1e6a0f1]
  - @contractspec/lib.overlay-engine@1.42.10
  - @contractspec/lib.contracts-spec@1.42.10
  - @contractspec/lib.knowledge@1.42.10
  - @contractspec/lib.schema@1.42.10
  - @contractspec/lib.bus@1.42.10

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry
- Updated dependencies [9281db7]
  - @contractspec/lib.overlay-engine@1.42.9
  - @contractspec/lib.contracts-spec@1.42.9
  - @contractspec/lib.knowledge@1.42.9
  - @contractspec/lib.schema@1.42.9
  - @contractspec/lib.bus@1.42.9

## 1.42.8

### Patch Changes

- e07b5ac: fix
- Updated dependencies [e07b5ac]
  - @contractspec/lib.overlay-engine@1.42.8
  - @contractspec/lib.contracts-spec@1.42.8
  - @contractspec/lib.knowledge@1.42.8
  - @contractspec/lib.schema@1.42.8
  - @contractspec/lib.bus@1.42.8

## 1.42.7

### Patch Changes

- e9b575d: fix release
- Updated dependencies [e9b575d]
  - @contractspec/lib.overlay-engine@1.42.7
  - @contractspec/lib.contracts-spec@1.42.7
  - @contractspec/lib.knowledge@1.42.7
  - @contractspec/lib.schema@1.42.7
  - @contractspec/lib.bus@1.42.7

## 1.42.6

### Patch Changes

- 1500242: fix tooling
- Updated dependencies [1500242]
  - @contractspec/lib.overlay-engine@1.42.6
  - @contractspec/lib.contracts-spec@1.42.6
  - @contractspec/lib.knowledge@1.42.6
  - @contractspec/lib.schema@1.42.6
  - @contractspec/lib.bus@1.42.6

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @contractspec/lib.overlay-engine@1.42.5
  - @contractspec/lib.contracts-spec@1.42.5
  - @contractspec/lib.knowledge@1.42.5
  - @contractspec/lib.schema@1.42.5
  - @contractspec/lib.bus@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @contractspec/lib.overlay-engine@1.42.4
  - @contractspec/lib.contracts-spec@1.42.4
  - @contractspec/lib.knowledge@1.42.4
  - @contractspec/lib.schema@1.42.4
  - @contractspec/lib.bus@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @contractspec/lib.bus@1.42.3
  - @contractspec/lib.contracts-spec@1.42.3
  - @contractspec/lib.knowledge@1.42.3
  - @contractspec/lib.overlay-engine@1.42.3
  - @contractspec/lib.schema@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @contractspec/lib.bus@1.42.2
  - @contractspec/lib.contracts-spec@1.42.2
  - @contractspec/lib.knowledge@1.42.2
  - @contractspec/lib.overlay-engine@1.42.2
  - @contractspec/lib.schema@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @contractspec/lib.overlay-engine@1.42.1
  - @contractspec/lib.contracts-spec@1.42.1
  - @contractspec/lib.knowledge@1.42.1
  - @contractspec/lib.schema@1.42.1
  - @contractspec/lib.bus@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @contractspec/lib.bus@1.42.0
  - @contractspec/lib.contracts-spec@1.42.0
  - @contractspec/lib.knowledge@1.42.0
  - @contractspec/lib.overlay-engine@1.42.0
  - @contractspec/lib.schema@1.42.0

## 0.4.0

### Minor Changes

- Refactor to be compatible with ai-sdk v6

### Patch Changes

- Updated dependencies
  - @contractspec/lib.bus@1.12.0
  - @contractspec/lib.overlay-engine@0.4.0

## 0.3.1

### Patch Changes

- Fix dependencies
- Updated dependencies
  - @contractspec/lib.bus@1.11.1
  - @contractspec/lib.overlay-engine@0.3.1

## 0.3.0

### Minor Changes

- b7621d3: Fix version

### Patch Changes

- Updated dependencies [b7621d3]
  - @contractspec/lib.bus@1.11.0
  - @contractspec/lib.overlay-engine@0.3.0

## 0.2.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.bus@1.10.0
  - @contractspec/lib.overlay-engine@0.2.0

## 0.1.2

### Patch Changes

- fix dependencies
- Updated dependencies
  - @contractspec/lib.bus@1.9.2
  - @contractspec/lib.overlay-engine@0.1.2

## 0.1.1

### Patch Changes

- fix
- Updated dependencies
  - @contractspec/lib.overlay-engine@0.1.1
  - @contractspec/lib.bus@1.9.1

## 0.1.0

### Minor Changes

- b1d0876: Managed platform

### Patch Changes

- Updated dependencies [b1d0876]
  - @contractspec/lib.overlay-engine@0.1.0
  - @contractspec/lib.bus@1.9.0

## 0.0.1

- Initial release with tracker, analyzer, adapter, and store primitives.
