# @contractspec/lib.lifecycle

## 3.7.28

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
  - @contractspec/lib.contracts-spec@6.3.0

## 3.7.27

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.contracts-spec@6.2.0

## 3.7.26

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - @contractspec/lib.contracts-spec@6.1.0

## 3.7.25

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.contracts-spec@6.0.0

## 3.7.24

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.contracts-spec@5.7.0

## 3.7.23

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.contracts-spec@5.6.0

## 3.7.22

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.contracts-spec@5.5.1

## 3.7.21

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.contracts-spec@5.5.0

## 3.7.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0

## 3.7.19

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0

## 3.7.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.contracts-spec@5.2.0

## 3.7.17

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-spec@5.1.0

## 3.7.16

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-spec@5.0.4

## 3.7.15

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-spec@5.0.3

## 3.7.14

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.2

## 3.7.13

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1

## 3.7.12

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0

## 3.7.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3

## 3.7.10

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2

## 3.7.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-spec@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-spec@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-spec@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-spec@3.7.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0

## 3.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-spec@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-spec@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-spec@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.contracts-spec@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-spec@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-spec@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-spec@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-spec@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-spec@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.contracts-spec@3.3.0

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-spec@3.2.0

## 3.1.1

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-spec@3.1.1

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0

## 3.0.0

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

## 2.9.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-spec@2.10.0

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.7.0

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.contracts-spec@2.6.0

## 2.5.0

### Minor Changes

- 284cbe2: Add full i18n support across all 10 packages with en/fr/es locales (460 keys total).

  - add shared `createI18nFactory<K>()` to `@contractspec/lib.contracts-spec/translations` to eliminate ~1,450 lines of duplicated boilerplate
  - add `src/i18n/` modules to all 10 packages with typed keys, locale resolution, message catalogs (en/fr/es), and completeness tests
  - thread `locale` parameter through public options interfaces and runtime functions in every package
  - convert all 55 `getDefaultI18n()` call sites in ai-agent to locale-aware `createAgentI18n()`
  - add locale-keyed keyword dictionaries (en/fr/es) to support-bot classifier
  - add `getLocalizedStageMeta()` and `getLocalizedStagePlaybooks()` to lifecycle packages
  - add `localeChannels` on notification templates with fr/es content for all standard templates
  - add `getXpSourceLabel(source, locale)` for localized XP source display in learning-journey
  - fix `slugify()` in content-gen to support non-Latin characters via Unicode property escapes
  - enable `i18next/no-literal-string` ESLint rule (warn, jsx-text-only) for all 10 packages
  - add `scripts/check-i18n-parity.ts` CI script and `bun run i18n:check` for catalog key parity verification

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0

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

## 0.4.0

### Minor Changes

- Refactor to be compatible with ai-sdk v6

## 0.3.1

### Patch Changes

- Fix dependencies

## 0.3.0

### Minor Changes

- b7621d3: Fix version

## 0.2.0

### Minor Changes

- fix

## 0.1.2

### Patch Changes

- fix dependencies

## 0.1.1

### Patch Changes

- fix

## 0.1.0

### Minor Changes

- b1d0876: Managed platform
