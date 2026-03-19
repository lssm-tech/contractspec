# @contractspec/lib.ai-providers

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.provider-ranking@0.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.provider-ranking@0.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.provider-ranking@0.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
  - @contractspec/lib.provider-ranking@0.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.provider-ranking@0.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.provider-ranking@0.7.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [ea320ea]
  - @contractspec/lib.provider-ranking@0.6.0

## 3.5.5

### Patch Changes

- 27b77db: feat(ai-models): add latest models and align defaults
  - Add claude-opus-4-6, claude-sonnet-4-6, claude-haiku-4-5, gpt-5.4, gpt-5-mini
  - Add mistral-large-2512, mistral-medium-2508, mistral-small-2506, devstral-2512
  - Add gemini-3.1-pro-preview, gemini-3.1-flash-lite-preview, gemini-3-flash-preview
  - Fix GPT-5.4 cost and context window; update default models to claude-sonnet-4-6
  - Enrich provider-ranking MCP with cost from ai-providers when store has none
  - Update model allowlist for gpt-5 and gemini 3.x; align agentpacks templates

- 693eedd: chore: improve ai models
- Updated dependencies [693eedd]
  - @contractspec/lib.provider-ranking@0.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
  - @contractspec/lib.provider-ranking@0.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.provider-ranking@0.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.provider-ranking@0.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.provider-ranking@0.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.provider-ranking@0.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.provider-ranking@0.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.provider-ranking@0.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.provider-ranking@0.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
  - @contractspec/lib.provider-ranking@0.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.provider-ranking@0.3.0

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.provider-ranking@0.2.0

## 3.1.1

### Patch Changes

- 02c0cc5: Fix lint and build errors across nine packages: remove unused imports and type imports from integration provider files, replace forbidden non-null assertions with proper type narrowing, and resolve TypeScript indexing error for `ColorSchemeName` in the Switch component.
- Updated dependencies [02c0cc5]
  - @contractspec/lib.provider-ranking@0.1.1

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- @contractspec/lib.provider-ranking@0.1.0

## 3.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

### Minor Changes

- 7cbdb7f: Make Mistral a first-class provider across contracts, runtime adapters, model catalogs, and CLI provider resolution so teams can run end-to-end Mistral workflows without custom patching.

  Add Mistral STT and conversational contract/runtime coverage plus a new `mistralvibe` agentpacks target, while keeping legacy provider flows backward compatible.

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

- 7f3203a: fix: make workspace test runs resilient when packages have no tests

  Updates package test scripts to pass cleanly when no matching test files exist:
  - Uses `bun test --pass-with-no-tests` in Bun-based packages that currently ship without test files.
  - Uses `jest --passWithNoTests` for the UI kit web package.
  - Adds `.vscode-test.mjs` for `vscode-contractspec` so VS Code extension test runs have an explicit config and stop failing on missing default configuration.

  This keeps `turbo run test` deterministic across the monorepo while preserving existing test execution behavior where tests are present.

## 1.62.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

## 1.61.0

### Minor Changes

- 374fd71: fix: publishing

## 1.60.0

### Minor Changes

- fix: publish with bun

## 1.59.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

## 1.58.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

## 1.57.0

### Minor Changes

- 11a5a05: feat: improve product intent

## 1.56.1

### Patch Changes

- fix: improve publish config

## 1.56.0

### Minor Changes

- fix: release

## 1.55.0

### Minor Changes

- fix: unpublished packages

## 1.54.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

## 1.53.0

### Minor Changes

- f4180d4: fix: performance improvement

## 1.52.0

### Minor Changes

- d93e6a9: fix: improve website

## 1.51.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

## 1.50.0

### Minor Changes

- 5325d6b: feat: improve seo

## 1.49.0

### Minor Changes

- cafd041: fix: impact report comments within github action

## 1.48.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

## 1.47.0

### Minor Changes

- caf8701: feat: add cli vibe command to run workflow
- c69b849: feat: add api web services (mcp & website)
- 42b8d78: feat: add cli `contractspec vibe` workflow to simplify usage
- fd38e85: feat: auto-fix contractspec issues

### Patch Changes

- e7ded36: feat: improve stability (adding ts-morph)
- c231a8b: test: improve workspace stability

## 1.46.2

### Patch Changes

- 7e21625: feat: library services (landing page & api)

## 1.46.1

### Patch Changes

- 2d8a72b: fix: mcp for presentation

## 1.46.0

### Minor Changes

- 07cb19b: feat: feat: cleaude code & opencode integrations

## 1.45.6

### Patch Changes

- a913074: feat: improve ai agents rules management"

## 1.45.5

### Patch Changes

- 9ddd7fa: feat: improve versioning

## 1.45.4

### Patch Changes

- fix: github action

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management

## 1.45.2

### Patch Changes

- 39ca241: code cleaning

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts

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

## 1.44.1

### Patch Changes

- 3c594fb: fix

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

## 1.43.3

### Patch Changes

- 9216062: fix: cross-platform compatibility

## 1.43.2

### Patch Changes

- 24d9759: improve documentation

## 1.43.1

### Patch Changes

- e147271: fix: improve stability

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry

## 1.42.8

### Patch Changes

- e07b5ac: fix

## 1.42.7

### Patch Changes

- e9b575d: fix release

## 1.42.6

### Patch Changes

- 1500242: fix tooling

## 1.42.5

### Patch Changes

- 1299719: fix vscode

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd

## 1.42.2

### Patch Changes

- 1f9ac4c: fix

## 1.42.1

### Patch Changes

- f043995: Fix release

## 1.42.0

### Minor Changes

- 8eefd9c: initial release
