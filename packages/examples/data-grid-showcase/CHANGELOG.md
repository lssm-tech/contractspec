# @contractspec/example.data-grid-showcase

## 3.8.21

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
  - @contractspec/lib.presentation-runtime-react@40.0.1
  - @contractspec/lib.ui-kit-web@3.13.2
  - @contractspec/lib.contracts-spec@6.2.0

## 3.8.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add design-system application shell primitives with typed navigation, command search, breadcrumbs, native bottom-tab adaptation, and PageOutline support.
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
- Updated dependencies because of Add an extensible design-system object reference handler for actionable references.
- Updated dependencies because of Render resolver-backed combobox results as a floating overlay instead of inline form content.
  - @contractspec/lib.design-system@4.3.0
  - @contractspec/lib.contracts-spec@6.1.0
  - @contractspec/lib.presentation-runtime-react@40.0.0
  - @contractspec/lib.ui-kit-web@3.13.1

## 3.8.19

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
  - @contractspec/lib.presentation-runtime-react@39.0.1
  - @contractspec/lib.contracts-spec@6.0.0
  - @contractspec/lib.design-system@4.2.0
  - @contractspec/lib.ui-kit-web@3.13.0

## 3.8.18

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.ui-kit-web@3.12.1
  - @contractspec/lib.design-system@4.1.0
  - @contractspec/lib.contracts-spec@5.7.0
  - @contractspec/lib.presentation-runtime-react@39.0.0

## 3.8.17

### Patch Changes

- Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - Packages: @contractspec/lib.design-system (minor), @contractspec/example.agent-console (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.data-grid-showcase (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.execution-console (patch)
  - Migration: Consumers should import tabs from `@contractspec/lib.design-system` instead of lower-level UI-kit tab modules.
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- Updated dependencies because of Keep shared table string headers and cells as primitive render-model values so React Native table renderers can wrap them in Text.
- Updated dependencies because of Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
- Updated dependencies because of Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - @contractspec/lib.ui-kit-web@3.12.0
  - @contractspec/lib.design-system@4.0.0
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.presentation-runtime-react@38.0.3
  - @contractspec/lib.schema@3.7.14

## 3.8.16

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/lib.presentation-runtime-react@38.0.2
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.design-system@3.11.2
  - @contractspec/lib.ui-kit-web@3.11.1
  - @contractspec/lib.schema@3.7.14

## 3.8.15

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
  - @contractspec/lib.design-system@3.11.1
  - @contractspec/lib.presentation-runtime-react@38.0.1
  - @contractspec/lib.ui-kit-web@3.11.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.schema@3.7.14

## 3.8.14

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add focused design-system subpaths and harden ThemeSpec runtime, Tailwind bridge, form-control helpers, and form renderer internals without changing root-import compatibility.
- Updated dependencies because of Add a ThemeSpec-aware and TranslationSpec-aware design-system form/control layer with stack primitives, exported control wrappers, and FormSpec renderer alignment.
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.presentation-runtime-react@38.0.0
  - @contractspec/lib.design-system@3.11.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.ui-kit-web@3.10.3
  - @contractspec/lib.schema@3.7.14

## 3.8.13

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/lib.design-system@3.10.1
  - @contractspec/lib.presentation-runtime-react@37.0.0
  - @contractspec/lib.ui-kit-web@3.10.2

## 3.8.12

### Patch Changes

- Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
  - Packages: @contractspec/lib.design-system (minor), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.data-grid-showcase (patch)
  - Migration: Keep the primitive `DataTable` lean and compose richer UX through the existing `toolbar` slot.; The examples now reset page index when search or status filters change so server-mode tables stay aligned with remote pagination.
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.design-system@3.10.0
  - @contractspec/lib.presentation-runtime-react@36.0.8
  - @contractspec/lib.ui-kit-web@3.10.1

## 3.8.11

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.design-system@3.9.0
  - @contractspec/lib.ui-kit-web@3.10.0
  - @contractspec/lib.presentation-runtime-react@36.0.7

## 3.8.10

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.design-system@3.8.11
  - @contractspec/lib.presentation-runtime-react@36.0.6
  - @contractspec/lib.ui-kit-web@3.9.10
  - @contractspec/lib.schema@3.7.14

## 3.8.9

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.presentation-runtime-react@36.0.5
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.design-system@3.8.10
  - @contractspec/lib.ui-kit-web@3.9.9
  - @contractspec/lib.schema@3.7.14

## 3.8.8

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.presentation-runtime-react@36.0.4
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.design-system@3.8.9
  - @contractspec/lib.ui-kit-web@3.9.8
  - @contractspec/lib.schema@3.7.13

## 3.8.7

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.presentation-runtime-react@36.0.3
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.design-system@3.8.8
  - @contractspec/lib.ui-kit-web@3.9.7
  - @contractspec/lib.schema@3.7.12

## 3.8.6

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.presentation-runtime-react@36.0.2
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.design-system@3.8.7
  - @contractspec/lib.ui-kit-web@3.9.6
  - @contractspec/lib.schema@3.7.11

## 3.8.5

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.design-system@3.8.6
  - @contractspec/lib.presentation-runtime-react@36.0.1
  - @contractspec/lib.ui-kit-web@3.9.5

## 3.8.4

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.schema@3.7.10
  - @contractspec/lib.design-system@3.8.5
  - @contractspec/lib.presentation-runtime-react@36.0.0
  - @contractspec/lib.ui-kit-web@3.9.4

## 3.8.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.presentation-runtime-react@35.0.4
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.design-system@3.8.4
  - @contractspec/lib.ui-kit-web@3.9.3
  - @contractspec/lib.schema@3.7.9

## 3.8.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.presentation-runtime-react@35.0.3
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.design-system@3.8.3
  - @contractspec/lib.ui-kit-web@3.9.2
  - @contractspec/lib.schema@3.7.8

## 3.8.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.presentation-runtime-react@35.0.2
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.design-system@3.8.2
  - @contractspec/lib.ui-kit-web@3.9.1
  - @contractspec/lib.schema@3.7.7
