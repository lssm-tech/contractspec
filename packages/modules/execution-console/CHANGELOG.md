# @contractspec/module.execution-console

## 0.1.14

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add first-class monorepo-aware environment contracts and managed/BYOK credential setup helpers.
- Updated dependencies because of Improve PageOutline desktop behavior with a Notion-like floating rail that keeps AppShell content centered while expanding on hover or keyboard focus.
  - @contractspec/lib.execution-lanes@0.1.11
  - @contractspec/lib.ui-kit-web@3.13.3
  - @contractspec/lib.contracts-spec@6.3.0
  - @contractspec/lib.design-system@4.4.2

## 0.1.13

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Fix AppShell desktop sidebar collapse/layout and web notification dismissal behavior.
- Updated dependencies because of Fix FormSpec phone country-select rendering to remove duplicated country adornments.
  - @contractspec/lib.design-system@4.4.1

## 0.1.12

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
  - @contractspec/lib.execution-lanes@0.1.10
  - @contractspec/lib.ui-kit-web@3.13.2
  - @contractspec/lib.contracts-spec@6.2.0

## 0.1.11

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
  - @contractspec/lib.execution-lanes@0.1.9
  - @contractspec/lib.contracts-spec@6.1.0
  - @contractspec/lib.ui-kit-web@3.13.1

## 0.1.10

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
  - @contractspec/lib.execution-lanes@0.1.8
  - @contractspec/lib.contracts-spec@6.0.0
  - @contractspec/lib.design-system@4.2.0
  - @contractspec/lib.ui-kit-web@3.13.0

## 0.1.9

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.execution-lanes@0.1.7
  - @contractspec/lib.ui-kit-web@3.12.1
  - @contractspec/lib.design-system@4.1.0
  - @contractspec/lib.contracts-spec@5.7.0

## 0.1.8

### Patch Changes

- Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - Packages: @contractspec/lib.design-system (minor), @contractspec/example.agent-console (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.data-grid-showcase (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.execution-console (patch)
  - Migration: Consumers should import tabs from `@contractspec/lib.design-system` instead of lower-level UI-kit tab modules.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- Updated dependencies because of Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
- Updated dependencies because of Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - @contractspec/lib.execution-lanes@0.1.6
  - @contractspec/lib.ui-kit-web@3.12.0
  - @contractspec/lib.design-system@4.0.0
  - @contractspec/lib.contracts-spec@5.6.0

## 0.1.7

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/lib.execution-lanes@0.1.5
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.ui-kit-web@3.11.1

## 0.1.6

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
  - @contractspec/lib.ui-kit-web@3.11.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.execution-lanes@0.1.4

## 0.1.5

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.execution-lanes@0.1.4
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.ui-kit-web@3.10.3

## 0.1.4

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/lib.ui-kit-web@3.10.2

## 0.1.3

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
  - @contractspec/lib.execution-lanes@0.1.3
  - @contractspec/lib.ui-kit-web@3.10.1

## 0.1.2

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.ui-kit-web@3.10.0
  - @contractspec/lib.execution-lanes@0.1.2

## 0.1.1

### Patch Changes

- Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - Packages: @contractspec/tool.bun (patch), @contractspec/bundle.marketing (patch), @contractspec/lib.accessibility (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.example-shared-ui (patch), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.surface-runtime (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-link (patch), @contractspec/lib.video-gen (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.examples (patch), @contractspec/module.execution-console (patch), @contractspec/module.mobile-review (patch)
  - Migration: Pull the patch releases for the affected Contractspec React/browser packages.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.execution-lanes@0.1.1
  - @contractspec/lib.ui-kit-web@3.9.10
