# @contractspec/lib.ui-kit-web

## 3.13.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
  - @contractspec/lib.presentation-runtime-core@5.2.2
  - @contractspec/lib.ui-kit-core@3.8.8
  - @contractspec/lib.contracts-spec@6.3.0

## 3.13.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.presentation-runtime-core@5.2.1
  - @contractspec/lib.ui-kit-core@3.8.7
  - @contractspec/lib.contracts-spec@6.2.0

## 3.13.1

### Patch Changes

- Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.presentation-runtime-core (minor), @contractspec/lib.presentation-runtime-react (minor), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.design-system (patch), @contractspec/module.workspace (patch), @contractspec/bundle.workspace (patch), @contractspec/app.cli-contractspec (patch), @contractspec/bundle.library (patch)
  - Migration: Existing tables keep working, but long prose, markdown, and detail-heavy columns can now declare their intended behavior.
- Render resolver-backed combobox results as a floating overlay instead of inline form content.
  - Packages: @contractspec/lib.ui-kit-web (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - @contractspec/lib.ui-kit-core@3.8.6
  - @contractspec/lib.contracts-spec@6.1.0
  - @contractspec/lib.presentation-runtime-core@5.2.0

## 3.13.0

### Minor Changes

- Improve FormSpec autocomplete rendering and resolver-backed search.
  - Packages: @contractspec/lib.contracts-spec (patch), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-web (minor)

### Patch Changes

- Keep web FormSpec datetime controls inside their responsive form columns.
  - Packages: @contractspec/lib.ui-kit-web (patch)
- Fix FormSpec password visibility toggles so rendered password fields can reveal and re-mask values.
  - Packages: @contractspec/lib.design-system (patch), @contractspec/lib.ui-kit-web (patch)
- Forward refs through the web Button primitive and its slotted rendering path to stabilize Radix `asChild` triggers.
  - Packages: @contractspec/lib.ui-kit-web (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.presentation-runtime-core@5.1.1
  - @contractspec/lib.ui-kit-core@3.8.5
  - @contractspec/lib.contracts-spec@6.0.0

## 3.12.1

### Patch Changes

- Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
  - Packages: @contractspec/biome-config (patch), contractspec (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit-core (patch), @contractspec/lib.design-system (patch)
  - Migration: Use ContractSpec layout and typography primitives in JSX surfaces.
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.ui-kit-core@3.8.4
  - @contractspec/lib.contracts-spec@5.7.0
  - @contractspec/lib.presentation-runtime-core@5.1.0

## 3.12.0

### Minor Changes

- Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-web (minor), @contractspec/lib.ui-kit (minor), @contractspec/lib.ui-kit-core (patch)
  - Migration: Existing text fields and custom driver slots remain compatible.; Prefer `text.password.purpose` for password fields instead of renderer-specific `uiProps.type`.

### Patch Changes

- Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
  - Packages: @contractspec/biome-config (patch), contractspec (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit-core (patch), @contractspec/lib.design-system (patch)
  - Migration: Use ContractSpec layout and typography primitives in JSX surfaces.
- Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
  - Packages: @contractspec/lib.ui-kit-web (patch)
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Support ios, android, native, and web platform suffixes in the shared Bun build tool and Metro presentation helper.
- Updated dependencies because of Add lucide package rewrites to the shared presentation runtime bundler helpers for Expo and Next.js.
  - @contractspec/lib.ui-kit-core@3.8.3
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.presentation-runtime-core@5.0.3

## 3.11.1

### Patch Changes

- Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - Packages: contractspec (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.ui-kit-web (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.presentation-runtime-core@5.0.2
  - @contractspec/lib.ui-kit-core@3.8.2
  - @contractspec/lib.contracts-spec@5.5.1

## 3.11.0

### Minor Changes

- Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
  - Packages: @contractspec/lib.ui-kit (major), @contractspec/integration.providers-impls (major), @contractspec/lib.runtime-sandbox (major), @contractspec/lib.example-shared-ui (major), @contractspec/lib.video-gen (major), @contractspec/lib.ui-kit-web (minor), @contractspec/app.cli-contractspec (minor), @contractspec/app.api-library (patch), @contractspec/app.registry-packs (patch), vscode-contractspec (patch), @contractspec/example.project-management-sync (patch), @contractspec/example.voice-providers (patch), @contractspec/example.meeting-recorder-providers (patch), @contractspec/example.integration-posthog (patch), contractspec (patch)
  - Migration: Consumers using native UI, provider implementations, sandbox database/runtime, example runtime UI, or Remotion video subpaths should add the corresponding optional peer packages directly to their app/package dependencies.; Replace broad `@contractspec/integration.providers-impls/impls` imports with provider-specific subpaths such as `@contractspec/integration.providers-impls/impls/linear`.; Run `bun run deps:audit --json` before and after dependency changes to compare runtime edges, heavy dependency families, and package dist sizes.

### Patch Changes

- Updated dependencies because of Stabilize Expo mobile chart rendering by avoiding CommonJS tslib helper resolution and completing native gesture-handler setup.
  - @contractspec/lib.presentation-runtime-core@5.0.1
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.ui-kit-core@3.8.1

## 3.10.3

### Patch Changes

- Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit (patch)
  - Migration: Existing forms continue to render without changes.; New multi-column forms should use `FormSpec.layout`, `group.layout`, and `field.layout.colSpan`.; New input addons should use `inputGroup.addons` on text and textarea fields.
  - Deprecations: `FieldSpec.wrapper.orientation` remains supported but should be replaced by `FieldSpec.layout.orientation` in new specs.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.ui-kit-core@3.8.1
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.presentation-runtime-core@5.0.0

## 3.10.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, and refresh the public docs to teach the current Next.js bundler path.
  - @contractspec/lib.presentation-runtime-core@4.0.0

## 3.10.1

### Patch Changes

- Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
  - Packages: @contractspec/lib.design-system (minor), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.data-grid-showcase (patch)
  - Migration: Keep the primitive `DataTable` lean and compose richer UX through the existing `toolbar` slot.; The examples now reset page index when search or status filters change so server-mode tables stay aligned with remote pagination.
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.presentation-runtime-core@3.9.8

## 3.10.0

### Minor Changes

- Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - Packages: contractspec (major), @contractspec/app.cli-contractspec (major), @contractspec/bundle.workspace (minor), @contractspec/module.workspace (minor), @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-core (minor), @contractspec/lib.ui-kit-web (minor), @contractspec/lib.ui-kit (minor), vscode-contractspec (minor)
  - Migration: Update automation, docs, and local shell habits to use the new generate-first CLI flow.
  - Deprecations: The standalone contractspec apply command has been removed; use contractspec generate for write-generation flows.

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.ui-kit-core@3.8.0
  - @contractspec/lib.presentation-runtime-core@3.9.7

## 3.9.10

### Patch Changes

- Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - Packages: @contractspec/tool.bun (patch), @contractspec/bundle.marketing (patch), @contractspec/lib.accessibility (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.example-shared-ui (patch), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.surface-runtime (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-link (patch), @contractspec/lib.video-gen (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.examples (patch), @contractspec/module.execution-console (patch), @contractspec/module.mobile-review (patch)
  - Migration: Pull the patch releases for the affected Contractspec React/browser packages.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.presentation-runtime-core@3.9.6
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.ui-kit-core@3.7.13

## 3.9.9

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.presentation-runtime-core@3.9.5
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.ui-kit-core@3.7.13

## 3.9.8

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.presentation-runtime-core@3.9.4
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.ui-kit-core@3.7.12

## 3.9.7

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.presentation-runtime-core@3.9.3
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.ui-kit-core@3.7.11

## 3.9.6

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.presentation-runtime-core@3.9.2
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.ui-kit-core@3.7.10

## 3.9.5

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.presentation-runtime-core@3.9.1

## 3.9.4

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.presentation-runtime-core@3.9.0

## 3.9.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.presentation-runtime-core@3.8.4
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.ui-kit-core@3.7.9

## 3.9.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.presentation-runtime-core@3.8.3
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.ui-kit-core@3.7.8

## 3.9.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.presentation-runtime-core@3.8.2
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.ui-kit-core@3.7.7

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.ui-kit-core@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.ui-kit-core@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.ui-kit-core@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.ui-kit-core@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
  - @contractspec/lib.ui-kit-core@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.ui-kit-core@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.ui-kit-core@3.7.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [ea320ea]
  - @contractspec/lib.ui-kit-core@3.6.0

## 3.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [693eedd]
  - @contractspec/lib.ui-kit-core@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
  - @contractspec/lib.ui-kit-core@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.ui-kit-core@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.ui-kit-core@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.ui-kit-core@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [230bdf6]
  - @contractspec/lib.ui-kit-core@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.ui-kit-core@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.ui-kit-core@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.ui-kit-core@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
  - @contractspec/lib.ui-kit-core@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.ui-kit-core@3.3.0

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.ui-kit-core@3.2.0

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [28987eb]
  - @contractspec/lib.ui-kit-core@3.1.0

## 3.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

### Patch Changes

- Updated dependencies [b781ce6]
  - @contractspec/lib.ui-kit-core@3.0.0

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-core@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-core@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-core@2.7.0

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.ui-kit-core@2.6.0

## 2.5.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [c83c323]
  - @contractspec/lib.ui-kit-core@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-core@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.ui-kit-core@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-core@2.2.0

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [362fbac]
  - @contractspec/lib.ui-kit-core@2.1.0

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
  - @contractspec/lib.ui-kit-core@2.0.0

## 1.62.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
  - @contractspec/lib.ui-kit-core@1.62.0

## 1.61.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.ui-kit-core@1.61.0

## 1.60.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-core@1.60.0

## 1.59.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.ui-kit-core@1.59.0

## 1.58.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
  - @contractspec/lib.ui-kit-core@1.58.0

## 1.57.0

### Minor Changes

- 11a5a05: feat: improve product intent

### Patch Changes

- Updated dependencies [11a5a05]
  - @contractspec/lib.ui-kit-core@1.57.0

## 1.56.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.ui-kit-core@1.56.1

## 1.56.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-core@1.56.0

## 1.55.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-core@1.55.0

## 1.54.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.ui-kit-core@1.54.0

## 1.53.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- Updated dependencies [f4180d4]
  - @contractspec/lib.ui-kit-core@1.53.0

## 1.52.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.ui-kit-core@1.52.0

## 1.51.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [e6faefb]
  - @contractspec/lib.ui-kit-core@1.51.0

## 1.50.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.ui-kit-core@1.50.0

## 1.49.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.ui-kit-core@1.49.0

## 1.48.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.ui-kit-core@1.48.0

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
  - @contractspec/lib.ui-kit-core@1.47.0

## 1.46.2

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.ui-kit-core@1.46.2

## 1.46.1

### Patch Changes

- 2d8a72b: fix: mcp for presentation
- Updated dependencies [2d8a72b]
  - @contractspec/lib.ui-kit-core@1.46.1

## 1.46.0

### Minor Changes

- 07cb19b: feat: feat: cleaude code & opencode integrations

### Patch Changes

- Updated dependencies [07cb19b]
  - @contractspec/lib.ui-kit-core@1.46.0

## 1.45.6

### Patch Changes

- a913074: feat: improve ai agents rules management"
- Updated dependencies [a913074]
  - @contractspec/lib.ui-kit-core@1.45.6

## 1.45.5

### Patch Changes

- 9ddd7fa: feat: improve versioning
- Updated dependencies [9ddd7fa]
  - @contractspec/lib.ui-kit-core@1.45.5

## 1.45.4

### Patch Changes

- fix: github action
- Updated dependencies
  - @contractspec/lib.ui-kit-core@1.45.4

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management
- Updated dependencies [e74ea9e]
  - @contractspec/lib.ui-kit-core@1.45.3

## 1.45.2

### Patch Changes

- 39ca241: code cleaning
- Updated dependencies [39ca241]
  - @contractspec/lib.ui-kit-core@1.45.2

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts
- Updated dependencies
  - @contractspec/lib.ui-kit-core@1.45.1

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
  - @contractspec/lib.ui-kit-core@1.45.0

## 1.44.1

### Patch Changes

- 3c594fb: fix
- Updated dependencies [3c594fb]
  - @contractspec/lib.ui-kit-core@1.44.1

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

### Patch Changes

- Updated dependencies [5f3a868]
  - @contractspec/lib.ui-kit-core@1.44.0

## 1.43.3

### Patch Changes

- 9216062: fix: cross-platform compatibility
- Updated dependencies [9216062]
  - @contractspec/lib.ui-kit-core@1.43.3

## 1.43.2

### Patch Changes

- 24d9759: improve documentation
- Updated dependencies [24d9759]
  - @contractspec/lib.ui-kit-core@1.43.2

## 1.43.1

### Patch Changes

- e147271: fix: improve stability
- Updated dependencies [e147271]
  - @contractspec/lib.ui-kit-core@1.43.1

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

### Patch Changes

- Updated dependencies [042d072]
  - @contractspec/lib.ui-kit-core@1.43.0

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server
- Updated dependencies [1e6a0f1]
  - @contractspec/lib.ui-kit-core@1.42.10

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry
- Updated dependencies [9281db7]
  - @contractspec/lib.ui-kit-core@1.42.9

## 1.42.8

### Patch Changes

- e07b5ac: fix
- Updated dependencies [e07b5ac]
  - @contractspec/lib.ui-kit-core@1.42.8

## 1.42.7

### Patch Changes

- e9b575d: fix release
- Updated dependencies [e9b575d]
  - @contractspec/lib.ui-kit-core@1.42.7

## 1.42.6

### Patch Changes

- 1500242: fix tooling
- Updated dependencies [1500242]
  - @contractspec/lib.ui-kit-core@1.42.6

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @contractspec/lib.ui-kit-core@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @contractspec/lib.ui-kit-core@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @contractspec/lib.ui-kit-core@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @contractspec/lib.ui-kit-core@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @contractspec/lib.ui-kit-core@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @contractspec/lib.ui-kit-core@1.42.0

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
