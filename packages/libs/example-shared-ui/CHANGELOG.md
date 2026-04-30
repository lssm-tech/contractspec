# @contractspec/lib.example-shared-ui

## 7.0.9

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Improve PageOutline desktop behavior with a Notion-like floating rail, and hide the AppShell page outline on small web screens to preserve layout stability.
  - @contractspec/lib.design-system@4.4.3

## 7.0.8

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
- Updated dependencies because of Improve PageOutline desktop behavior with a Notion-like floating rail that keeps AppShell content centered while expanding on hover or keyboard focus.
  - @contractspec/lib.presentation-runtime-core@5.2.2
  - @contractspec/lib.surface-runtime@0.5.28
  - @contractspec/lib.ui-kit-web@3.13.3
  - @contractspec/lib.contracts-spec@6.3.0
  - @contractspec/lib.design-system@4.4.2

## 7.0.7

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Fix AppShell desktop sidebar collapse/layout and web notification dismissal behavior.
- Updated dependencies because of Fix FormSpec phone country-select rendering to remove duplicated country adornments.
  - @contractspec/lib.design-system@4.4.1

## 7.0.6

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Promote object-reference detail panels to a reusable adaptive sheet/drawer surface.
- Updated dependencies because of Route design-system mobile menu overlays through the shared AdaptivePanel primitive.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.design-system@4.4.0
  - @contractspec/lib.presentation-runtime-core@5.2.1
  - @contractspec/lib.surface-runtime@0.5.27
  - @contractspec/lib.ui-kit-web@3.13.2
  - @contractspec/lib.contracts-spec@6.2.0

## 7.0.5

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add design-system application shell primitives with typed navigation, command search, breadcrumbs, native bottom-tab adaptation, and PageOutline support.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
- Updated dependencies because of Add an extensible design-system object reference handler for actionable references.
- Updated dependencies because of Render resolver-backed combobox results as a floating overlay instead of inline form content.
  - @contractspec/lib.design-system@4.3.0
  - @contractspec/lib.surface-runtime@0.5.26
  - @contractspec/lib.contracts-spec@6.1.0
  - @contractspec/lib.presentation-runtime-core@5.2.0
  - @contractspec/lib.ui-kit-web@3.13.1

## 7.0.4

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Add grouped option support to design-system Select controls across web and native.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Keep web FormSpec datetime controls inside their responsive form columns.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Preserve FormSpec email input behavior when optional renderer metadata is omitted.
- Updated dependencies because of Add ThemeSpec Tailwind aliases for FormSpec option surface backgrounds.
- Updated dependencies because of Fix FormSpec password visibility toggles so rendered password fields can reveal and re-mask values.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
- Updated dependencies because of Forward refs through the web Button primitive and its slotted rendering path to stabilize Radix `asChild` triggers.
  - @contractspec/lib.presentation-runtime-core@5.1.1
  - @contractspec/lib.surface-runtime@0.5.25
  - @contractspec/lib.contracts-spec@6.0.0
  - @contractspec/lib.design-system@4.2.0
  - @contractspec/lib.ui-kit-web@3.13.0

## 7.0.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.surface-runtime@0.5.24
  - @contractspec/lib.ui-kit-web@3.12.1
  - @contractspec/lib.design-system@4.1.0
  - @contractspec/lib.contracts-spec@5.7.0
  - @contractspec/lib.presentation-runtime-core@5.1.0

## 7.0.2

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- Updated dependencies because of Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
- Updated dependencies because of Support ios, android, native, and web platform suffixes in the shared Bun build tool and Metro presentation helper.
- Updated dependencies because of Add lucide package rewrites to the shared presentation runtime bundler helpers for Expo and Next.js.
- Updated dependencies because of Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - @contractspec/lib.surface-runtime@0.5.23
  - @contractspec/lib.ui-kit-web@3.12.0
  - @contractspec/lib.design-system@4.0.0
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.presentation-runtime-core@5.0.3

## 7.0.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/lib.presentation-runtime-core@5.0.2
  - @contractspec/lib.surface-runtime@0.5.22
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.design-system@3.11.2
  - @contractspec/lib.ui-kit-web@3.11.1

## 7.0.0

### Major Changes

- Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
  - Packages: @contractspec/lib.ui-kit (major), @contractspec/integration.providers-impls (major), @contractspec/lib.runtime-sandbox (major), @contractspec/lib.example-shared-ui (major), @contractspec/lib.video-gen (major), @contractspec/lib.ui-kit-web (minor), @contractspec/app.cli-contractspec (minor), @contractspec/app.api-library (patch), @contractspec/app.registry-packs (patch), vscode-contractspec (patch), @contractspec/example.project-management-sync (patch), @contractspec/example.voice-providers (patch), @contractspec/example.meeting-recorder-providers (patch), @contractspec/example.integration-posthog (patch), contractspec (patch)
  - Migration: Consumers using native UI, provider implementations, sandbox database/runtime, example runtime UI, or Remotion video subpaths should add the corresponding optional peer packages directly to their app/package dependencies.; Replace broad `@contractspec/integration.providers-impls/impls` imports with provider-specific subpaths such as `@contractspec/integration.providers-impls/impls/linear`.; Run `bun run deps:audit --json` before and after dependency changes to compare runtime edges, heavy dependency families, and package dist sizes.

### Patch Changes

- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
- Updated dependencies because of Stabilize Expo mobile chart rendering by avoiding CommonJS tslib helper resolution and completing native gesture-handler setup.
  - @contractspec/lib.design-system@3.11.1
  - @contractspec/lib.ui-kit-web@3.11.0
  - @contractspec/lib.presentation-runtime-core@5.0.1
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.surface-runtime@0.5.21

## 6.0.22

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add focused design-system subpaths and harden ThemeSpec runtime, Tailwind bridge, form-control helpers, and form renderer internals without changing root-import compatibility.
- Updated dependencies because of Add a ThemeSpec-aware and TranslationSpec-aware design-system form/control layer with stack primitives, exported control wrappers, and FormSpec renderer alignment.
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, publish bundler helpers from dist artifacts, and refresh the public docs to teach the current Next.js bundler path.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.surface-runtime@0.5.21
  - @contractspec/lib.design-system@3.11.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.ui-kit-web@3.10.3
  - @contractspec/lib.presentation-runtime-core@5.0.0

## 6.0.21

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Replace the old Next alias helper with explicit Webpack and Turbopack helpers, keep Metro stable, and refresh the public docs to teach the current Next.js bundler path.
  - @contractspec/lib.design-system@3.10.1
  - @contractspec/lib.ui-kit-web@3.10.2
  - @contractspec/lib.presentation-runtime-core@4.0.0

## 6.0.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.presentation-runtime-core@3.9.8
  - @contractspec/lib.surface-runtime@0.5.20
  - @contractspec/lib.design-system@3.10.0
  - @contractspec/lib.ui-kit-web@3.10.1

## 6.0.19

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.design-system@3.9.0
  - @contractspec/lib.ui-kit-web@3.10.0
  - @contractspec/lib.presentation-runtime-core@3.9.7
  - @contractspec/lib.surface-runtime@0.5.19

## 6.0.18

### Patch Changes

- Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - Packages: @contractspec/tool.bun (patch), @contractspec/bundle.marketing (patch), @contractspec/lib.accessibility (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.example-shared-ui (patch), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.surface-runtime (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-link (patch), @contractspec/lib.video-gen (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.examples (patch), @contractspec/module.execution-console (patch), @contractspec/module.mobile-review (patch)
  - Migration: Pull the patch releases for the affected Contractspec React/browser packages.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.presentation-runtime-core@3.9.6
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.design-system@3.8.11
  - @contractspec/lib.surface-runtime@0.5.18
  - @contractspec/lib.ui-kit-web@3.9.10

## 6.0.17

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.presentation-runtime-core@3.9.5
  - @contractspec/lib.surface-runtime@0.5.17
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.design-system@3.8.10
  - @contractspec/lib.ui-kit-web@3.9.9

## 6.0.16

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.presentation-runtime-core@3.9.4
  - @contractspec/lib.surface-runtime@0.5.16
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.design-system@3.8.9
  - @contractspec/lib.ui-kit-web@3.9.8

## 6.0.15

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.presentation-runtime-core@3.9.3
  - @contractspec/lib.surface-runtime@0.5.15
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.design-system@3.8.8
  - @contractspec/lib.ui-kit-web@3.9.7

## 6.0.14

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.presentation-runtime-core@3.9.2
  - @contractspec/lib.surface-runtime@0.5.14
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.design-system@3.8.7
  - @contractspec/lib.ui-kit-web@3.9.6

## 6.0.13

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.design-system@3.8.6
  - @contractspec/lib.presentation-runtime-core@3.9.1
  - @contractspec/lib.surface-runtime@0.5.13
  - @contractspec/lib.ui-kit-web@3.9.5

## 6.0.12

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.presentation-runtime-core@3.9.0
  - @contractspec/lib.design-system@3.8.5
  - @contractspec/lib.surface-runtime@0.5.12
  - @contractspec/lib.ui-kit-web@3.9.4

## 6.0.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.surface-runtime@0.5.11
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.design-system@3.8.4
  - @contractspec/lib.ui-kit-web@3.9.3

## 6.0.10

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.surface-runtime@0.5.10
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.design-system@3.8.3
  - @contractspec/lib.ui-kit-web@3.9.2

## 6.0.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.surface-runtime@0.5.9
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.design-system@3.8.2
  - @contractspec/lib.ui-kit-web@3.9.1

## 6.0.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.surface-runtime@0.5.6
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.design-system@3.7.6
  - @contractspec/lib.ui-kit-web@3.7.6

## 6.0.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.surface-runtime@0.5.5
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.design-system@3.7.5
  - @contractspec/lib.ui-kit-web@3.7.5

## 6.0.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.surface-runtime@0.5.4
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.design-system@3.7.4
  - @contractspec/lib.ui-kit-web@3.7.4

## 6.0.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.surface-runtime@0.5.3
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.design-system@3.7.3
  - @contractspec/lib.ui-kit-web@3.7.3

## 6.0.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.surface-runtime@0.5.2
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.design-system@3.7.2
  - @contractspec/lib.ui-kit-web@3.7.2

## 6.0.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.surface-runtime@0.5.1
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.design-system@3.7.1
  - @contractspec/lib.ui-kit-web@3.7.1

## 6.0.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.surface-runtime@0.5.0
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.design-system@3.7.0
  - @contractspec/lib.ui-kit-web@3.7.0

## 5.0.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/lib.surface-runtime@0.4.0
  - @contractspec/lib.design-system@3.6.0
  - @contractspec/lib.ui-kit-web@3.6.0

## 4.0.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.surface-runtime@0.3.5
  - @contractspec/lib.design-system@3.5.5
  - @contractspec/lib.ui-kit-web@3.5.5

## 4.0.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.surface-runtime@0.3.4
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.design-system@3.5.4
  - @contractspec/lib.ui-kit-web@3.5.4

## 4.0.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.surface-runtime@0.3.3
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.design-system@3.5.3
  - @contractspec/lib.ui-kit-web@3.5.3

## 4.0.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.surface-runtime@0.3.2
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.design-system@3.5.2
  - @contractspec/lib.ui-kit-web@3.5.2

## 4.0.1

### Patch Changes

- 73a7f8d: Update SpecDrivenTemplateShell.
- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.surface-runtime@0.3.1
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.design-system@3.5.1
  - @contractspec/lib.ui-kit-web@3.5.1

## 4.0.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- 66c51da: feat(example-shared-ui): add SpecDrivenTemplateShell, ExampleTemplateBundle, bundles export

  - Add SpecDrivenTemplateShell component
  - Add ExampleTemplateBundle and bundles/index
  - Add optional peer @contractspec/lib.surface-runtime

- Updated dependencies [1fa29a0]
- Updated dependencies [230bdf6]
  - @contractspec/lib.surface-runtime@0.3.0
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.design-system@3.5.0
  - @contractspec/lib.ui-kit-web@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.design-system@3.4.3
  - @contractspec/lib.ui-kit-web@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.design-system@3.4.2
  - @contractspec/lib.ui-kit-web@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.design-system@3.4.1
  - @contractspec/lib.ui-kit-web@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.design-system@3.4.0
  - @contractspec/lib.ui-kit-web@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/lib.design-system@3.3.0
  - @contractspec/lib.ui-kit-web@3.3.0

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-spec@3.2.0
  - @contractspec/lib.design-system@3.2.0
  - @contractspec/lib.ui-kit-web@3.2.0

## 3.1.1

### Patch Changes

- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-spec@3.1.1
  - @contractspec/lib.design-system@3.1.1

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0
  - @contractspec/lib.design-system@3.1.0
  - @contractspec/lib.ui-kit-web@3.1.0

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
  - @contractspec/lib.design-system@3.0.0
  - @contractspec/lib.ui-kit-web@3.0.0

## 2.9.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-spec@2.10.0
  - @contractspec/lib.design-system@2.9.1

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.9.0
  - @contractspec/lib.design-system@2.9.0
  - @contractspec/lib.ui-kit-web@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.design-system@2.8.0
  - @contractspec/lib.ui-kit-web@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.design-system@2.7.0
  - @contractspec/lib.ui-kit-web@2.7.0

## 2.6.1

### Patch Changes

- Updated dependencies [f8dc3ad]
  - @contractspec/lib.design-system@2.6.1

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.design-system@2.6.0
  - @contractspec/lib.ui-kit-web@2.6.0

## 2.5.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.design-system@2.5.0
  - @contractspec/lib.ui-kit-web@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/lib.design-system@2.4.0
  - @contractspec/lib.ui-kit-web@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.design-system@2.3.0
  - @contractspec/lib.ui-kit-web@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.design-system@2.2.0
  - @contractspec/lib.ui-kit-web@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/lib.design-system@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.design-system@2.1.0
  - @contractspec/lib.ui-kit-web@2.1.0

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
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/lib.design-system@2.0.0
  - @contractspec/lib.ui-kit-web@2.0.0

## 1.16.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/lib.design-system@1.62.0
  - @contractspec/lib.ui-kit-web@1.62.0
  - @contractspec/lib.contracts@1.62.0

## 1.15.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.design-system@1.61.0
  - @contractspec/lib.ui-kit-web@1.61.0
  - @contractspec/lib.contracts-spec@1.61.0

## 1.14.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.design-system@1.60.0
  - @contractspec/lib.ui-kit-web@1.60.0
  - @contractspec/lib.contracts-spec@1.60.0

## 1.13.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.design-system@1.59.0
  - @contractspec/lib.ui-kit-web@1.59.0
  - @contractspec/lib.contracts-spec@1.59.0

## 1.12.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/lib.design-system@1.58.0
  - @contractspec/lib.ui-kit-web@1.58.0
  - @contractspec/lib.contracts-spec@1.58.0

## 1.11.0

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
  - @contractspec/lib.design-system@1.57.0
  - @contractspec/lib.ui-kit-web@1.57.0

## 1.10.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.design-system@1.56.1
  - @contractspec/lib.ui-kit-web@1.56.1
  - @contractspec/lib.contracts-spec@1.56.1

## 1.10.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.design-system@1.56.0
  - @contractspec/lib.ui-kit-web@1.56.0
  - @contractspec/lib.contracts-spec@1.56.0

## 1.9.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.design-system@1.55.0
  - @contractspec/lib.ui-kit-web@1.55.0
  - @contractspec/lib.contracts-spec@1.55.0

## 1.8.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.design-system@1.54.0
  - @contractspec/lib.ui-kit-web@1.54.0
  - @contractspec/lib.contracts-spec@1.54.0

## 1.7.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- Updated dependencies [eefeb1b]
- Updated dependencies [5b371b1]
- Updated dependencies [f4180d4]
- Updated dependencies [64d84e1]
  - @contractspec/lib.design-system@1.53.0
  - @contractspec/lib.contracts-spec@1.53.0
  - @contractspec/lib.ui-kit-web@1.53.0

## 1.6.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.design-system@1.52.0
  - @contractspec/lib.ui-kit-web@1.52.0
  - @contractspec/lib.contracts-spec@1.52.0

## 1.5.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [23e46e9]
- Updated dependencies [ad1f852]
- Updated dependencies [e6faefb]
  - @contractspec/lib.contracts-spec@1.51.0
  - @contractspec/lib.design-system@1.51.0
  - @contractspec/lib.ui-kit-web@1.51.0

## 1.4.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.contracts-spec@1.50.0
  - @contractspec/lib.design-system@1.50.0
  - @contractspec/lib.ui-kit-web@1.50.0

## 1.3.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.design-system@1.49.0
  - @contractspec/lib.ui-kit-web@1.49.0
  - @contractspec/lib.contracts-spec@1.49.0

## 1.2.1

### Patch Changes

- Updated dependencies [c560ee7]
- Updated dependencies [1536bf3]
  - @contractspec/lib.design-system@1.48.1
  - @contractspec/lib.contracts-spec@1.48.1

## 1.2.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.design-system@1.48.0
  - @contractspec/lib.ui-kit-web@1.48.0
  - @contractspec/lib.contracts-spec@1.48.0

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
  - @contractspec/lib.design-system@1.47.0
  - @contractspec/lib.ui-kit-web@1.47.0
  - @contractspec/lib.contracts-spec@1.47.0

## 1.0.1

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.design-system@1.46.2
  - @contractspec/lib.ui-kit-web@1.46.2
  - @contractspec/lib.contracts-spec@1.46.2
