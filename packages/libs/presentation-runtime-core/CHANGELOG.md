# @contractspec/lib.presentation-runtime-core

## 5.0.3

### Patch Changes

- Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
  - Packages: @contractspec/lib.design-system (major), @contractspec/lib.presentation-runtime-core (patch), @contractspec/bundle.library (patch)
  - Migration: Move direct design-system platform imports from `.mobile` to `.native`.
  - Deprecations: Direct imports such as `@contractspec/lib.design-system/components/molecules/Tabs.mobile` have been replaced by `.native` subpaths.
- Support ios, android, native, and web platform suffixes in the shared Bun build tool and Metro presentation helper.
  - Packages: @contractspec/tool.bun (patch), @contractspec/lib.presentation-runtime-core (patch)
  - Migration: Run contractspec-bun-build prebuild in packages that add or rename .ios, .android, .native, or .web source entries.
- Add lucide package rewrites to the shared presentation runtime bundler helpers for Expo and Next.js.
  - Packages: @contractspec/lib.presentation-runtime-core (patch)
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.contracts-spec@5.6.0

## 5.0.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.contracts-spec@5.5.1

## 5.0.1

### Patch Changes

- Stabilize Expo mobile chart rendering by avoiding CommonJS tslib helper resolution and completing native gesture-handler setup.
  - Packages: @contractspec/lib.presentation-runtime-core (patch), @contractspec/app.expo-demo (patch)
  - Migration: Native Metro resolver changes and gesture-handler entry setup require a clean dev-server restart.
  - @contractspec/lib.contracts-spec@5.5.0

## 5.0.0

### Major Changes

- Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
  - Packages: @contractspec/lib.presentation-runtime-core (major)
  - Migration: The old helper name has been removed in favor of bundler-specific names.; Turbopack aliasing is now configured by patching the full Next config object instead of mutating a webpack resolver config.

### Patch Changes

- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.contracts-spec@5.5.0

## 4.0.0

### Major Changes

- Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, and refresh the public docs to teach the current Next.js bundler path.
  - Packages: @contractspec/lib.presentation-runtime-core (major)
  - Migration: The old helper name has been removed in favor of bundler-specific names.; Turbopack aliasing is now configured by patching the full Next config object instead of mutating a webpack resolver config.

## 3.9.8

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0

## 3.9.7

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0

## 3.9.6

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.contracts-spec@5.2.0

## 3.9.5

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-spec@5.1.0

## 3.9.4

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-spec@5.0.4

## 3.9.3

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-spec@5.0.3

## 3.9.2

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.2

## 3.9.1

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1

## 3.9.0

### Minor Changes

- 81256ea: Make `@contractspec/lib.contracts-spec` contract-model only and move concrete
  runtime and integration code to dedicated packages.

  Major changes:

  - Remove `@contractspec/lib.contracts-spec/presentations/transform-engine`.
  - Remove all `@contractspec/lib.contracts-spec/integrations*` export paths.
  - Remove `@contractspec/lib.contracts-spec/jobs/scaleway-sqs-queue`.
  - Remove provider-type re-exports for email, embedding, LLM, storage, and
    vector-store surfaces from the `@contractspec/lib.contracts-spec` root
    barrel.
  - Keep `PresentationSpec` unchanged while moving transform-engine runtime logic
    out of the contract package.

  New runtime surfaces:

  - Add `@contractspec/lib.presentation-runtime-core/transform-engine` for the
    core transform engine, validators, and markdown/json/xml rendering support.
  - Add `@contractspec/lib.contracts-runtime-client-react/transform-engine` for
    React render descriptors and React-specific transform-engine helpers.
  - Update `@contractspec/lib.contracts-runtime-server-mcp` to use the core
    transform engine without React registration.

  Migration notes:

  - Import integration provider and secret types from
    `@contractspec/lib.contracts-integrations`.
  - Import transform-engine core APIs from
    `@contractspec/lib.presentation-runtime-core/transform-engine`.
  - Import React-specific transform-engine helpers from
    `@contractspec/lib.contracts-runtime-client-react/transform-engine`.

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0

## 3.8.4

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3

## 3.8.3

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2

## 3.8.2

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1

## 3.7.6

### Patch Changes

- fix: release manifest

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

## 1.12.0

### Minor Changes

- Refactor to be compatible with ai-sdk v6

## 1.11.1

### Patch Changes

- Fix dependencies

## 1.11.0

### Minor Changes

- b7621d3: Fix version

## 1.10.0

### Minor Changes

- fix

## 1.9.2

### Patch Changes

- fix dependencies

## 1.9.1

### Patch Changes

- fix

## 1.9.0

### Minor Changes

- b1d0876: Managed platform

## 1.8.0

### Minor Changes

- f1f4ddd: Foundation Hardening

## 1.7.4

### Patch Changes

- fix typing

## 1.7.3

### Patch Changes

- add right-sidebar

## 1.7.2

### Patch Changes

- fix typing

## 1.7.1

### Patch Changes

- fix typing

## 1.7.0

### Minor Changes

- fixii

## 1.6.0

### Minor Changes

- fix versionnnn

## 1.5.0

### Minor Changes

- fix

## 1.4.0

### Minor Changes

- fix exports

## 1.3.0

### Minor Changes

- fix it

## 1.2.0

### Minor Changes

- fix

## 1.1.0

### Minor Changes

- fix
- 748b3a2: fix publish

## 1.1.0

### Minor Changes

- eeba130: fix publish
