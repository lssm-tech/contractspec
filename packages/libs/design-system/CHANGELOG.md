# @contractspec/lib.design-system

## 4.4.1

### Patch Changes

- Fix AppShell desktop sidebar collapse/layout and web notification dismissal behavior.
  - Packages: @contractspec/lib.design-system (patch)
- Fix FormSpec phone country-select rendering to remove duplicated country adornments.
  - Packages: @contractspec/lib.design-system (patch)

## 4.4.0

### Minor Changes

- Promote object-reference detail panels to a reusable adaptive sheet/drawer surface.
  - Packages: @contractspec/lib.design-system (minor)
- Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.translation-runtime (minor), @contractspec/lib.design-system (minor), @contractspec/example.locale-jurisdiction-gate (patch)
  - Migration: Prefer `meta.key: "bundle.messages"` with `locale: "fr-FR"` over stable keys that encode locale suffixes.; The i18next adapter exports ContractSpec ICU messages intact and does not make i18next canonical.
- Add preference-aware DataView collection defaults and personalization adapters.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.design-system (minor), @contractspec/lib.personalization (minor), @contractspec/bundle.library (patch)
- Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.notification (minor), @contractspec/module.notifications (patch), @contractspec/lib.design-system (minor), @contractspec/example.crm-pipeline (patch), @contractspec/example.wealth-snapshot (patch), @contractspec/example.saas-boilerplate (patch)
  - Migration: Move new notification integrations away from the module shim.; Provide notification items and callbacks to the design-system shell without coupling it to a delivery runtime.
  - Deprecations: The `@contractspec/module.notifications` package remains import-compatible for this release, but new code should import contracts from `@contractspec/lib.contracts-spec/notifications` and runtime helpers from `@contractspec/lib.notification`.
- Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor)
- Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.identity-rbac (minor), @contractspec/lib.design-system (minor), @contractspec/lib.personalization (minor)
  - Migration: Existing policies continue to work; add roles, permissions, policy refs, and field policies when a contract needs stronger authorization metadata.

### Patch Changes

- Route design-system mobile menu overlays through the shared AdaptivePanel primitive.
  - Packages: @contractspec/lib.design-system (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add an optional ContractSpec-first i18next adapter for downstream interoperability.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.ai-agent@8.0.15
  - @contractspec/lib.presentation-runtime-core@5.2.1
  - @contractspec/lib.presentation-runtime-react@40.0.1
  - @contractspec/lib.ui-kit@4.1.4
  - @contractspec/lib.ui-kit-core@3.8.7
  - @contractspec/lib.ui-kit-web@3.13.2
  - @contractspec/lib.contracts-spec@6.2.0
  - @contractspec/lib.translation-runtime@0.2.0
  - @contractspec/lib.contracts-runtime-client-react@3.14.0

## 4.3.0

### Minor Changes

- Add design-system application shell primitives with typed navigation, command search, breadcrumbs, native bottom-tab adaptation, and PageOutline support.
  - Packages: @contractspec/lib.design-system (minor), @contractspec/bundle.library (patch), @contractspec/bundle.marketing (patch)
  - Migration: Existing shell-related imports keep working, but new application frames should use the focused shell entrypoint.
- Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.design-system (minor), @contractspec/module.workspace (patch), @contractspec/bundle.workspace (patch), @contractspec/app.cli-contractspec (patch), @contractspec/bundle.library (patch)
- Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor)
  - Migration: New field kinds provide stronger semantics and formatting metadata for finance and operations forms.
- Add an extensible design-system object reference handler for actionable references.
  - Packages: @contractspec/lib.design-system (minor)

### Patch Changes

- Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.presentation-runtime-core (minor), @contractspec/lib.presentation-runtime-react (minor), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.design-system (patch), @contractspec/module.workspace (patch), @contractspec/bundle.workspace (patch), @contractspec/app.cli-contractspec (patch), @contractspec/bundle.library (patch)
  - Migration: Existing tables keep working, but long prose, markdown, and detail-heavy columns can now declare their intended behavior.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
- Updated dependencies because of Render resolver-backed combobox results as a floating overlay instead of inline form content.
  - @contractspec/lib.ai-agent@8.0.14
  - @contractspec/lib.contracts-spec@6.1.0
  - @contractspec/lib.presentation-runtime-react@40.0.0
  - @contractspec/lib.ui-kit-web@3.13.1
  - @contractspec/lib.ui-kit@4.1.3
  - @contractspec/lib.contracts-runtime-client-react@3.13.0

## 4.2.0

### Minor Changes

- Add grouped option support to design-system Select controls across web and native.
  - Packages: @contractspec/lib.design-system (minor)
- Improve FormSpec autocomplete rendering and resolver-backed search.
  - Packages: @contractspec/lib.contracts-spec (patch), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-web (minor)
- Add first-class FormSpec email fields with native renderer affordances.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor)
  - Migration: Existing `kind: "text"` fields with email input hints continue to render normally.; `kind: "email"` only describes rendering intent; strict validation remains schema-owned.
- Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor)
  - Migration: Existing forms render exactly as before unless they opt into `layout.flow`.; Use `layout.flow.sections` to group existing fields by immediate field name.

### Patch Changes

- Preserve FormSpec email input behavior when optional renderer metadata is omitted.
  - Packages: @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch)
- Add ThemeSpec Tailwind aliases for FormSpec option surface backgrounds.
  - Packages: @contractspec/lib.design-system (patch)
- Fix FormSpec password visibility toggles so rendered password fields can reveal and re-mask values.
  - Packages: @contractspec/lib.design-system (patch), @contractspec/lib.ui-kit-web (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Keep web FormSpec datetime controls inside their responsive form columns.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Preserve FormSpec email input behavior when optional renderer metadata is omitted.
- Updated dependencies because of Fix FormSpec password visibility toggles so rendered password fields can reveal and re-mask values.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
- Updated dependencies because of Forward refs through the web Button primitive and its slotted rendering path to stabilize Radix `asChild` triggers.
  - @contractspec/lib.ai-agent@8.0.13
  - @contractspec/lib.presentation-runtime-react@39.0.1
  - @contractspec/lib.ui-kit@4.1.2
  - @contractspec/lib.contracts-spec@6.0.0
  - @contractspec/lib.contracts-runtime-client-react@3.12.0
  - @contractspec/lib.ui-kit-web@3.13.0

## 4.1.0

### Minor Changes

- Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

### Patch Changes

- Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
  - Packages: @contractspec/biome-config (patch), contractspec (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit-core (patch), @contractspec/lib.design-system (patch)
  - Migration: Use ContractSpec layout and typography primitives in JSX surfaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.ai-agent@8.0.12
  - @contractspec/lib.ui-kit@4.1.1
  - @contractspec/lib.ui-kit-web@3.12.1
  - @contractspec/lib.contracts-spec@5.7.0
  - @contractspec/lib.contracts-runtime-client-react@3.11.1
  - @contractspec/lib.presentation-runtime-react@39.0.0

## 4.0.0

### Major Changes

- Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
  - Packages: @contractspec/lib.design-system (major), @contractspec/lib.presentation-runtime-core (patch), @contractspec/bundle.library (patch)
  - Migration: Move direct design-system platform imports from `.mobile` to `.native`.
  - Deprecations: Direct imports such as `@contractspec/lib.design-system/components/molecules/Tabs.mobile` have been replaced by `.native` subpaths.

### Minor Changes

- Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-web (minor), @contractspec/lib.ui-kit (minor), @contractspec/lib.ui-kit-core (patch)
  - Migration: Existing text fields and custom driver slots remain compatible.; Prefer `text.password.purpose` for password fields instead of renderer-specific `uiProps.type`.
- Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - Packages: @contractspec/lib.design-system (minor), @contractspec/example.agent-console (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.data-grid-showcase (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.execution-console (patch)
  - Migration: Consumers should import tabs from `@contractspec/lib.design-system` instead of lower-level UI-kit tab modules.

### Patch Changes

- Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
  - Packages: @contractspec/biome-config (patch), contractspec (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit-core (patch), @contractspec/lib.design-system (patch)
  - Migration: Use ContractSpec layout and typography primitives in JSX surfaces.
- Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
  - Packages: @contractspec/tool.bun (patch), @contractspec/lib.design-system (patch), @contractspec/module.ai-chat (patch)
  - Migration: Replace root design-system imports in published UI modules with exact public component subpaths.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Replace the native UI-kit data table resize handle's gesture-handler dependency with a Reanimated responder boundary.
- Updated dependencies because of Harden native Pagination layout with shared stack primitives, safer page math, and accessible control labels.
- Updated dependencies because of Keep shared table string headers and cells as primitive render-model values so React Native table renderers can wrap them in Text.
- Updated dependencies because of Add native UI-kit subpaths for Metro's ui-kit-web alias surface so Expo builds can resolve shared design-system form controls.
- Updated dependencies because of Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
  - @contractspec/lib.ai-agent@8.0.11
  - @contractspec/lib.ui-kit@4.1.0
  - @contractspec/lib.ui-kit-web@3.12.0
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.contracts-runtime-client-react@3.11.0
  - @contractspec/lib.presentation-runtime-react@38.0.3

## 3.11.2

### Patch Changes

- Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - Packages: contractspec (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.ui-kit-web (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/lib.ai-agent@8.0.10
  - @contractspec/lib.presentation-runtime-react@38.0.2
  - @contractspec/lib.ui-kit@4.0.1
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.contracts-runtime-client-react@3.10.2
  - @contractspec/lib.ui-kit-web@3.11.1

## 3.11.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
  - @contractspec/lib.contracts-runtime-client-react@3.10.1
  - @contractspec/lib.presentation-runtime-react@38.0.1
  - @contractspec/lib.ui-kit@4.0.0
  - @contractspec/lib.ui-kit-web@3.11.0
  - @contractspec/lib.ai-agent@8.0.9
  - @contractspec/lib.contracts-spec@5.5.0

## 3.11.0

### Minor Changes

- Add focused design-system subpaths and harden ThemeSpec runtime, Tailwind bridge, form-control helpers, and form renderer internals without changing root-import compatibility.
  - Packages: @contractspec/lib.design-system (minor)
- Add a ThemeSpec-aware and TranslationSpec-aware design-system form/control layer with stack primitives, exported control wrappers, and FormSpec renderer alignment.
  - Packages: @contractspec/lib.design-system (minor)
- Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit (patch)
  - Migration: Existing forms continue to render without changes.; New multi-column forms should use `FormSpec.layout`, `group.layout`, and `field.layout.colSpan`.; New input addons should use `inputGroup.addons` on text and textarea fields.
  - Deprecations: `FieldSpec.wrapper.orientation` remains supported but should be replaced by `FieldSpec.layout.orientation` in new specs.
- Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
  - Packages: @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/tool.bun (patch)
  - Migration: Avoid broad root-barrel imports for mobile FormSpec rendering while keeping one shared design-system renderer.
- Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/lib.design-system (minor)

### Patch Changes

- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.ai-agent@8.0.9
  - @contractspec/lib.presentation-runtime-react@38.0.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.contracts-runtime-client-react@3.10.0
  - @contractspec/lib.ui-kit-web@3.10.3
  - @contractspec/lib.ui-kit@3.9.3

## 3.10.1

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/lib.contracts-runtime-client-react@3.9.2
  - @contractspec/lib.presentation-runtime-react@37.0.0
  - @contractspec/lib.ui-kit@3.9.2
  - @contractspec/lib.ui-kit-web@3.10.2

## 3.10.0

### Minor Changes

- Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
  - Packages: @contractspec/lib.design-system (minor), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-kit (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.data-grid-showcase (patch)
  - Migration: Keep the primitive `DataTable` lean and compose richer UX through the existing `toolbar` slot.; The examples now reset page index when search or status filters change so server-mode tables stay aligned with remote pagination.

### Patch Changes

- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.ai-agent@8.0.8
  - @contractspec/lib.contracts-runtime-client-react@3.9.1
  - @contractspec/lib.presentation-runtime-react@36.0.8
  - @contractspec/lib.ui-kit-web@3.10.1
  - @contractspec/lib.ui-kit@3.9.1

## 3.9.0

### Minor Changes

- Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - Packages: contractspec (major), @contractspec/app.cli-contractspec (major), @contractspec/bundle.workspace (minor), @contractspec/module.workspace (minor), @contractspec/lib.contracts-spec (minor), @contractspec/lib.contracts-runtime-client-react (minor), @contractspec/lib.design-system (minor), @contractspec/lib.ui-kit-core (minor), @contractspec/lib.ui-kit-web (minor), @contractspec/lib.ui-kit (minor), vscode-contractspec (minor)
  - Migration: Update automation, docs, and local shell habits to use the new generate-first CLI flow.
  - Deprecations: The standalone contractspec apply command has been removed; use contractspec generate for write-generation flows.

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.contracts-runtime-client-react@3.9.0
  - @contractspec/lib.ui-kit-web@3.10.0
  - @contractspec/lib.ui-kit@3.9.0
  - @contractspec/lib.ai-agent@8.0.7
  - @contractspec/lib.presentation-runtime-react@36.0.7

## 3.8.11

### Patch Changes

- Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - Packages: @contractspec/tool.bun (patch), @contractspec/bundle.marketing (patch), @contractspec/lib.accessibility (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.example-shared-ui (patch), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.surface-runtime (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-link (patch), @contractspec/lib.video-gen (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.examples (patch), @contractspec/module.execution-console (patch), @contractspec/module.mobile-review (patch)
  - Migration: Pull the patch releases for the affected Contractspec React/browser packages.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.ai-agent@8.0.6
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.contracts-runtime-client-react@3.8.6
  - @contractspec/lib.presentation-runtime-react@36.0.6
  - @contractspec/lib.ui-kit@3.8.10
  - @contractspec/lib.ui-kit-web@3.9.10

## 3.8.10

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-runtime-client-react@3.8.5
  - @contractspec/lib.presentation-runtime-react@36.0.5
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.ui-kit-web@3.9.9
  - @contractspec/lib.ai-agent@8.0.5
  - @contractspec/lib.ui-kit@3.8.9

## 3.8.9

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-runtime-client-react@3.8.4
  - @contractspec/lib.presentation-runtime-react@36.0.4
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.ui-kit-web@3.9.8
  - @contractspec/lib.ai-agent@8.0.4
  - @contractspec/lib.ui-kit@3.8.8

## 3.8.8

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-runtime-client-react@3.8.3
  - @contractspec/lib.presentation-runtime-react@36.0.3
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.ui-kit-web@3.9.7
  - @contractspec/lib.ai-agent@8.0.3
  - @contractspec/lib.ui-kit@3.8.7

## 3.8.7

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-runtime-client-react@3.8.2
  - @contractspec/lib.presentation-runtime-react@36.0.2
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.ui-kit-web@3.9.6
  - @contractspec/lib.ai-agent@8.0.2
  - @contractspec/lib.ui-kit@3.8.6

## 3.8.6

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.ai-agent@8.0.1
  - @contractspec/lib.contracts-runtime-client-react@3.8.1
  - @contractspec/lib.presentation-runtime-react@36.0.1
  - @contractspec/lib.ui-kit-web@3.9.5
  - @contractspec/lib.ui-kit@3.8.6

## 3.8.5

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.contracts-runtime-client-react@3.8.0
  - @contractspec/lib.ai-agent@8.0.0
  - @contractspec/lib.presentation-runtime-react@36.0.0
  - @contractspec/lib.ui-kit-web@3.9.4
  - @contractspec/lib.ui-kit@3.8.5

## 3.8.4

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-runtime-client-react@3.7.11
  - @contractspec/lib.presentation-runtime-react@35.0.4
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.ui-kit-web@3.9.3
  - @contractspec/lib.ai-agent@7.0.11
  - @contractspec/lib.ui-kit@3.8.4

## 3.8.3

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-runtime-client-react@3.7.10
  - @contractspec/lib.presentation-runtime-react@35.0.3
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.ui-kit-web@3.9.2
  - @contractspec/lib.ai-agent@7.0.10
  - @contractspec/lib.ui-kit@3.8.3

## 3.8.2

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-runtime-client-react@3.7.9
  - @contractspec/lib.presentation-runtime-react@35.0.2
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.ui-kit-web@3.9.1
  - @contractspec/lib.ai-agent@7.0.9
  - @contractspec/lib.ui-kit@3.8.2

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-runtime-client-react@3.7.6
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.ui-kit-web@3.7.6
  - @contractspec/lib.ai-agent@7.0.6
  - @contractspec/lib.ui-kit@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-runtime-client-react@3.7.5
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.ui-kit-web@3.7.5
  - @contractspec/lib.ai-agent@7.0.5
  - @contractspec/lib.ui-kit@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-runtime-client-react@3.7.4
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.ui-kit-web@3.7.4
  - @contractspec/lib.ai-agent@7.0.4
  - @contractspec/lib.ui-kit@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-runtime-client-react@3.7.3
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.ui-kit-web@3.7.3
  - @contractspec/lib.ai-agent@7.0.3
  - @contractspec/lib.ui-kit@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-runtime-client-react@3.7.2
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.ui-kit-web@3.7.2
  - @contractspec/lib.ai-agent@7.0.2
  - @contractspec/lib.ui-kit@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-runtime-client-react@3.7.1
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.ui-kit-web@3.7.1
  - @contractspec/lib.ai-agent@7.0.1
  - @contractspec/lib.ui-kit@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-runtime-client-react@3.7.0
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.ui-kit-web@3.7.0
  - @contractspec/lib.ai-agent@7.0.0
  - @contractspec/lib.ui-kit@3.7.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.ai-agent@6.0.0
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/lib.contracts-runtime-client-react@3.6.0
  - @contractspec/lib.ui-kit-web@3.6.0
  - @contractspec/lib.ui-kit@3.6.0

## 3.5.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.ai-agent@5.0.5
  - @contractspec/lib.contracts-runtime-client-react@3.5.5
  - @contractspec/lib.ui-kit-web@3.5.5
  - @contractspec/lib.ui-kit@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-runtime-client-react@3.5.4
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.ui-kit-web@3.5.4
  - @contractspec/lib.ai-agent@5.0.4
  - @contractspec/lib.ui-kit@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
- Updated dependencies [56ae36d]
  - @contractspec/lib.contracts-runtime-client-react@3.5.3
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.ui-kit-web@3.5.3
  - @contractspec/lib.ai-agent@5.0.3
  - @contractspec/lib.ui-kit@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-runtime-client-react@3.5.2
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.ui-kit-web@3.5.2
  - @contractspec/lib.ai-agent@5.0.2
  - @contractspec/lib.ui-kit@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
- Updated dependencies [73a7f8d]
  - @contractspec/lib.contracts-runtime-client-react@3.5.1
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.ui-kit-web@3.5.1
  - @contractspec/lib.ai-agent@5.0.1
  - @contractspec/lib.ui-kit@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- Updated dependencies [66c51da]
- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-runtime-client-react@3.5.0
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.ui-kit-web@3.5.0
  - @contractspec/lib.ai-agent@5.0.0
  - @contractspec/lib.ui-kit@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-runtime-client-react@3.4.3
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.ui-kit-web@3.4.3
  - @contractspec/lib.ai-agent@4.0.3
  - @contractspec/lib.ui-kit@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-runtime-client-react@3.4.2
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.ui-kit-web@3.4.2
  - @contractspec/lib.ai-agent@4.0.2
  - @contractspec/lib.ui-kit@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-runtime-client-react@3.4.1
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.ui-kit-web@3.4.1
  - @contractspec/lib.ai-agent@4.0.1
  - @contractspec/lib.ui-kit@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-runtime-client-react@3.4.0
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.ui-kit-web@3.4.0
  - @contractspec/lib.ai-agent@4.0.0
  - @contractspec/lib.ui-kit@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
  - @contractspec/lib.contracts-runtime-client-react@3.3.0
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/lib.ui-kit-web@3.3.0
  - @contractspec/lib.ai-agent@3.3.0
  - @contractspec/lib.ui-kit@3.3.0

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-runtime-client-react@3.2.0
  - @contractspec/lib.contracts-spec@3.2.0
  - @contractspec/lib.ui-kit-web@3.2.0
  - @contractspec/lib.ai-agent@3.2.0
  - @contractspec/lib.ui-kit@3.2.0

## 3.1.1

### Patch Changes

- 02c0cc5: Fix lint and build errors across nine packages: remove unused imports and type imports from integration provider files, replace forbidden non-null assertions with proper type narrowing, and resolve TypeScript indexing error for `ColorSchemeName` in the Switch component.
- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-spec@3.1.1
  - @contractspec/lib.ui-kit@3.1.1
  - @contractspec/lib.ai-agent@3.1.1
  - @contractspec/lib.contracts-runtime-client-react@3.1.1

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0
  - @contractspec/lib.ai-agent@3.1.0
  - @contractspec/lib.contracts-runtime-client-react@3.1.0
  - @contractspec/lib.ui-kit-web@3.1.0
  - @contractspec/lib.ui-kit@3.1.0

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
  - @contractspec/lib.contracts-runtime-client-react@3.0.0
  - @contractspec/lib.ui-kit-web@3.0.0
  - @contractspec/lib.ai-agent@3.0.0
  - @contractspec/lib.ui-kit@3.0.0

## 2.9.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-spec@2.10.0
  - @contractspec/lib.ai-agent@2.9.1
  - @contractspec/lib.contracts-runtime-client-react@2.9.1

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-runtime-client-react@2.9.0
  - @contractspec/lib.contracts-spec@2.9.0
  - @contractspec/lib.ui-kit-web@2.9.0
  - @contractspec/lib.ai-agent@2.9.0
  - @contractspec/lib.ui-kit@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ai-agent@2.8.0
  - @contractspec/lib.contracts-runtime-client-react@2.8.0
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.ui-kit@2.8.0
  - @contractspec/lib.ui-kit-web@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ai-agent@2.7.0
  - @contractspec/lib.contracts-runtime-client-react@2.7.0
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.ui-kit@2.7.0
  - @contractspec/lib.ui-kit-web@2.7.0

## 2.6.1

### Patch Changes

- f8dc3ad: Fix the marketing header language switcher flicker on desktop by removing hover-driven dropdown toggling.

  Clean related design-system header issues by wiring mobile language and command search props, fixing a stray nav label typo, correcting sheet title placement, and avoiding barrel import cycles in filter toolbars.

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.ai-agent@2.6.0
  - @contractspec/lib.contracts-runtime-client-react@2.6.0
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.ui-kit@2.6.0
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
  - @contractspec/lib.ai-agent@2.5.0
  - @contractspec/lib.contracts-runtime-client-react@2.5.0
  - @contractspec/lib.ui-kit-web@2.5.0
  - @contractspec/lib.ui-kit@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-runtime-client-react@2.4.0
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/lib.ui-kit-web@2.4.0
  - @contractspec/lib.ai-agent@2.4.0
  - @contractspec/lib.ui-kit@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-runtime-client-react@2.3.0
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.ui-kit-web@2.3.0
  - @contractspec/lib.ai-agent@2.3.0
  - @contractspec/lib.ui-kit@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-runtime-client-react@2.2.0
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.ui-kit-web@2.2.0
  - @contractspec/lib.ai-agent@2.2.0
  - @contractspec/lib.ui-kit@2.2.0

## 2.1.1

### Patch Changes

- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/lib.ai-agent@2.1.1
  - @contractspec/lib.contracts-runtime-client-react@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.contracts-runtime-client-react@2.1.0
  - @contractspec/lib.ui-kit-web@2.1.0
  - @contractspec/lib.ai-agent@2.1.0
  - @contractspec/lib.ui-kit@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Patch Changes

- f152678: Scaffolded split contracts packages for spec+registry, integrations definitions, and runtime adapters by surface (client-react, server-rest, server-graphql, server-mcp). Migrated first consumers and documentation examples to the new runtime package imports.
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
  - @contractspec/lib.contracts-runtime-client-react@2.0.0
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/lib.ui-kit-web@2.0.0
  - @contractspec/lib.ai-agent@2.0.0
  - @contractspec/lib.ui-kit@2.0.0

## 1.62.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/lib.ai-agent@1.62.0
  - @contractspec/lib.ui-kit-web@1.62.0
  - @contractspec/lib.contracts@1.62.0
  - @contractspec/lib.ui-kit@1.62.0

## 1.61.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.ui-kit-web@1.61.0
  - @contractspec/lib.contracts-spec@1.61.0
  - @contractspec/lib.ai-agent@1.61.0
  - @contractspec/lib.ui-kit@1.61.0

## 1.60.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.60.0
  - @contractspec/lib.contracts-spec@1.60.0
  - @contractspec/lib.ai-agent@1.60.0
  - @contractspec/lib.ui-kit@1.60.0

## 1.59.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.ui-kit-web@1.59.0
  - @contractspec/lib.contracts-spec@1.59.0
  - @contractspec/lib.ai-agent@1.59.0
  - @contractspec/lib.ui-kit@1.59.0

## 1.58.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/lib.ui-kit-web@1.58.0
  - @contractspec/lib.contracts-spec@1.58.0
  - @contractspec/lib.ai-agent@1.58.0
  - @contractspec/lib.ui-kit@1.58.0

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
  - @contractspec/lib.ui-kit-web@1.57.0
  - @contractspec/lib.ai-agent@1.57.0
  - @contractspec/lib.ui-kit@1.57.0

## 1.56.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.56.1
  - @contractspec/lib.contracts-spec@1.56.1
  - @contractspec/lib.ai-agent@1.56.1
  - @contractspec/lib.ui-kit@1.56.1

## 1.56.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.56.0
  - @contractspec/lib.contracts-spec@1.56.0
  - @contractspec/lib.ai-agent@1.56.0
  - @contractspec/lib.ui-kit@1.56.0

## 1.55.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.55.0
  - @contractspec/lib.contracts-spec@1.55.0
  - @contractspec/lib.ai-agent@1.55.0
  - @contractspec/lib.ui-kit@1.55.0

## 1.54.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.ui-kit-web@1.54.0
  - @contractspec/lib.contracts-spec@1.54.0
  - @contractspec/lib.ui-kit@1.54.0
  - @contractspec/lib.ai-agent@1.54.0

## 1.53.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- eefeb1b: Split the generated docs index into a manifest and chunked JSON files to reduce bundle size and load reference data lazily, updating reference pages and generator outputs accordingly.
- Updated dependencies [5b371b1]
- Updated dependencies [f4180d4]
- Updated dependencies [64d84e1]
  - @contractspec/lib.contracts-spec@1.53.0
  - @contractspec/lib.ai-agent@1.53.0
  - @contractspec/lib.ui-kit@1.53.0
  - @contractspec/lib.ui-kit-web@1.53.0

## 1.52.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.ui-kit-web@1.52.0
  - @contractspec/lib.contracts-spec@1.52.0
  - @contractspec/lib.ai-agent@1.52.0
  - @contractspec/lib.ui-kit@1.52.0

## 1.51.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [23e46e9]
- Updated dependencies [ad1f852]
- Updated dependencies [e6faefb]
  - @contractspec/lib.contracts-spec@1.51.0
  - @contractspec/lib.ui-kit-web@1.51.0
  - @contractspec/lib.ai-agent@1.51.0
  - @contractspec/lib.ui-kit@1.51.0

## 1.50.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.contracts-spec@1.50.0
  - @contractspec/lib.ai-agent@1.50.0
  - @contractspec/lib.ui-kit@1.50.0
  - @contractspec/lib.ui-kit-web@1.50.0

## 1.49.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.ui-kit-web@1.49.0
  - @contractspec/lib.contracts-spec@1.49.0
  - @contractspec/lib.ai-agent@1.49.0
  - @contractspec/lib.ui-kit@1.49.0

## 1.48.1

### Patch Changes

- c560ee7: Add onboarding and documentation surfaces across the library and marketing bundles, plus small tracking, telemetry, and UI copy refinements to support adoption workflows.
- 1536bf3: Improve static rendering for marketing/docs pages, streamline changelog aggregation, and keep the header interactions compatible with static builds.
- Updated dependencies [c560ee7]
  - @contractspec/lib.contracts-spec@1.48.1
  - @contractspec/lib.ai-agent@1.48.1

## 1.48.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.ui-kit-web@1.48.0
  - @contractspec/lib.contracts-spec@1.48.0
  - @contractspec/lib.ai-agent@1.48.0
  - @contractspec/lib.ui-kit@1.48.0

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
  - @contractspec/lib.ui-kit-web@1.47.0
  - @contractspec/lib.contracts-spec@1.47.0
  - @contractspec/lib.ai-agent@1.47.0
  - @contractspec/lib.ui-kit@1.47.0

## 1.46.2

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.ui-kit-web@1.46.2
  - @contractspec/lib.contracts-spec@1.46.2
  - @contractspec/lib.ai-agent@1.46.2
  - @contractspec/lib.ui-kit@1.46.2

## 1.46.1

### Patch Changes

- 2d8a72b: fix: mcp for presentation
- Updated dependencies [2d8a72b]
  - @contractspec/lib.ui-kit-web@1.46.1
  - @contractspec/lib.contracts-spec@1.46.1
  - @contractspec/lib.ai-agent@1.46.1
  - @contractspec/lib.ui-kit@1.46.1

## 1.46.0

### Minor Changes

- 07cb19b: feat: feat: cleaude code & opencode integrations

### Patch Changes

- Updated dependencies [07cb19b]
  - @contractspec/lib.ui-kit-web@1.46.0
  - @contractspec/lib.contracts-spec@1.46.0
  - @contractspec/lib.ai-agent@1.46.0
  - @contractspec/lib.ui-kit@1.46.0

## 1.45.6

### Patch Changes

- a913074: feat: improve ai agents rules management"
- Updated dependencies [a913074]
  - @contractspec/lib.ui-kit-web@1.45.6
  - @contractspec/lib.contracts-spec@1.45.6
  - @contractspec/lib.ai-agent@1.45.6
  - @contractspec/lib.ui-kit@1.45.6

## 1.45.5

### Patch Changes

- 9ddd7fa: feat: improve versioning
- Updated dependencies [9ddd7fa]
  - @contractspec/lib.ui-kit-web@1.45.5
  - @contractspec/lib.contracts-spec@1.45.5
  - @contractspec/lib.ai-agent@1.45.5
  - @contractspec/lib.ui-kit@1.45.5

## 1.45.4

### Patch Changes

- fix: github action
- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.45.4
  - @contractspec/lib.contracts-spec@1.45.4
  - @contractspec/lib.ai-agent@1.45.4
  - @contractspec/lib.ui-kit@1.45.4

## 1.45.3

### Patch Changes

- e74ea9e: feat: version management
- Updated dependencies [e74ea9e]
  - @contractspec/lib.ui-kit-web@1.45.3
  - @contractspec/lib.contracts-spec@1.45.3
  - @contractspec/lib.ai-agent@1.45.3
  - @contractspec/lib.ui-kit@1.45.3

## 1.45.2

### Patch Changes

- 39ca241: code cleaning
- Updated dependencies [39ca241]
  - @contractspec/lib.ui-kit-web@1.45.2
  - @contractspec/lib.contracts-spec@1.45.2
  - @contractspec/lib.ai-agent@1.45.2
  - @contractspec/lib.ui-kit@1.45.2

## 1.45.1

### Patch Changes

- feat: improve app config and examples contracts
- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.45.1
  - @contractspec/lib.contracts-spec@1.45.1
  - @contractspec/lib.ai-agent@1.45.1
  - @contractspec/lib.ui-kit@1.45.1

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
  - @contractspec/lib.ui-kit-web@1.45.0
  - @contractspec/lib.contracts-spec@1.45.0
  - @contractspec/lib.ai-agent@1.45.0
  - @contractspec/lib.ui-kit@1.45.0

## 1.44.1

### Patch Changes

- 3c594fb: fix
- Updated dependencies [3c594fb]
  - @contractspec/lib.ui-kit-web@1.44.1
  - @contractspec/lib.contracts-spec@1.44.1
  - @contractspec/lib.ai-agent@1.44.1
  - @contractspec/lib.ui-kit@1.44.1

## 1.44.0

### Minor Changes

- 5f3a868: chore: isolate branding to contractspec.io

### Patch Changes

- Updated dependencies [5f3a868]
  - @contractspec/lib.ui-kit-web@1.44.0
  - @contractspec/lib.contracts-spec@1.44.0
  - @contractspec/lib.ai-agent@1.44.0
  - @contractspec/lib.ui-kit@1.44.0

## 1.43.4

### Patch Changes

- 9216062: fix: cross-platform compatibility
- Updated dependencies [9216062]
  - @contractspec/lib.ui-kit-web@1.43.3
  - @contractspec/lib.contracts-spec@1.43.4
  - @contractspec/lib.ai-agent@1.43.4
  - @contractspec/lib.ui-kit@1.43.3

## 1.43.3

### Patch Changes

- 24d9759: improve documentation
- Updated dependencies [24d9759]
  - @contractspec/lib.ui-kit-web@1.43.2
  - @contractspec/lib.contracts-spec@1.43.3
  - @contractspec/lib.ai-agent@1.43.3
  - @contractspec/lib.ui-kit@1.43.2

## 1.43.2

### Patch Changes

- e147271: fix: improve stability
- Updated dependencies [e147271]
  - @contractspec/lib.contracts-spec@1.43.2
  - @contractspec/lib.ai-agent@1.43.2
  - @contractspec/lib.ui-kit@1.43.1
  - @contractspec/lib.ui-kit-web@1.43.1

## 1.43.1

### Patch Changes

- Updated dependencies [f28fdad]
  - @contractspec/lib.contracts-spec@1.43.1
  - @contractspec/lib.ai-agent@1.43.1

## 1.43.0

### Minor Changes

- 042d072: feat: schema declaration using json schema, including zod

### Patch Changes

- Updated dependencies [042d072]
  - @contractspec/lib.ui-kit-web@1.43.0
  - @contractspec/lib.contracts-spec@1.43.0
  - @contractspec/lib.ai-agent@1.43.0
  - @contractspec/lib.ui-kit@1.43.0

## 1.42.10

### Patch Changes

- 1e6a0f1: fix: mcp server
- Updated dependencies [1e6a0f1]
  - @contractspec/lib.ui-kit-web@1.42.10
  - @contractspec/lib.contracts-spec@1.42.10
  - @contractspec/lib.ai-agent@1.42.10
  - @contractspec/lib.ui-kit@1.42.10

## 1.42.9

### Patch Changes

- 9281db7: fix ModelRegistry
- Updated dependencies [9281db7]
  - @contractspec/lib.ui-kit-web@1.42.9
  - @contractspec/lib.contracts-spec@1.42.9
  - @contractspec/lib.ai-agent@1.42.9
  - @contractspec/lib.ui-kit@1.42.9

## 1.42.8

### Patch Changes

- e07b5ac: fix
- Updated dependencies [e07b5ac]
  - @contractspec/lib.ui-kit-web@1.42.8
  - @contractspec/lib.contracts-spec@1.42.8
  - @contractspec/lib.ai-agent@1.42.8
  - @contractspec/lib.ui-kit@1.42.8

## 1.42.7

### Patch Changes

- e9b575d: fix release
- Updated dependencies [e9b575d]
  - @contractspec/lib.ui-kit-web@1.42.7
  - @contractspec/lib.contracts-spec@1.42.7
  - @contractspec/lib.ai-agent@1.42.7
  - @contractspec/lib.ui-kit@1.42.7

## 1.42.6

### Patch Changes

- 1500242: fix tooling
- Updated dependencies [1500242]
  - @contractspec/lib.ui-kit-web@1.42.6
  - @contractspec/lib.contracts-spec@1.42.6
  - @contractspec/lib.ai-agent@1.42.6
  - @contractspec/lib.ui-kit@1.42.6

## 1.42.5

### Patch Changes

- 1299719: fix vscode
- Updated dependencies [1299719]
  - @contractspec/lib.ui-kit-web@1.42.5
  - @contractspec/lib.contracts-spec@1.42.5
  - @contractspec/lib.ai-agent@1.42.5
  - @contractspec/lib.ui-kit@1.42.5

## 1.42.4

### Patch Changes

- ac28b99: fix: generate from openapi
- Updated dependencies [ac28b99]
  - @contractspec/lib.ui-kit-web@1.42.4
  - @contractspec/lib.contracts-spec@1.42.4
  - @contractspec/lib.ai-agent@1.42.4
  - @contractspec/lib.ui-kit@1.42.4

## 1.42.3

### Patch Changes

- 3f5d015: fix(tooling): cicd
- Updated dependencies [3f5d015]
  - @contractspec/lib.ai-agent@1.42.3
  - @contractspec/lib.contracts-spec@1.42.3
  - @contractspec/lib.ui-kit@1.42.3
  - @contractspec/lib.ui-kit-web@1.42.3

## 1.42.2

### Patch Changes

- 1f9ac4c: fix
- Updated dependencies [1f9ac4c]
  - @contractspec/lib.ai-agent@1.42.2
  - @contractspec/lib.contracts-spec@1.42.2
  - @contractspec/lib.ui-kit@1.42.2
  - @contractspec/lib.ui-kit-web@1.42.2

## 1.42.1

### Patch Changes

- f043995: Fix release
- Updated dependencies [f043995]
  - @contractspec/lib.ui-kit-web@1.42.1
  - @contractspec/lib.contracts-spec@1.42.1
  - @contractspec/lib.ai-agent@1.42.1
  - @contractspec/lib.ui-kit@1.42.1

## 1.42.0

### Minor Changes

- 8eefd9c: initial release

### Patch Changes

- Updated dependencies [8eefd9c]
  - @contractspec/lib.ai-agent@1.42.0
  - @contractspec/lib.contracts-spec@1.42.0
  - @contractspec/lib.ui-kit@1.42.0
  - @contractspec/lib.ui-kit-web@1.42.0

## 1.12.0

### Minor Changes

- Refactor to be compatible with ai-sdk v6

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ai-agent@1.1.0
  - @contractspec/lib.contracts-spec@1.12.0
  - @contractspec/lib.ui-kit@1.12.0
  - @contractspec/lib.ui-kit-web@1.12.0

## 1.11.1

### Patch Changes

- Fix dependencies
- Updated dependencies
  - @contractspec/lib.ai-agent@0.4.1
  - @contractspec/lib.contracts-spec@1.11.1
  - @contractspec/lib.ui-kit@1.11.1
  - @contractspec/lib.ui-kit-web@1.11.1

## 1.11.0

### Minor Changes

- b7621d3: Fix version

### Patch Changes

- Updated dependencies [b7621d3]
  - @contractspec/lib.ai-agent@0.4.0
  - @contractspec/lib.contracts-spec@1.11.0
  - @contractspec/lib.ui-kit@1.11.0
  - @contractspec/lib.ui-kit-web@1.11.0

## 1.10.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ai-agent@0.3.0
  - @contractspec/lib.contracts-spec@1.10.0
  - @contractspec/lib.ui-kit@1.10.0
  - @contractspec/lib.ui-kit-web@1.10.0

## 1.9.2

### Patch Changes

- fix dependencies
- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.9.2
  - @contractspec/lib.ai-agent@0.2.2
  - @contractspec/lib.contracts-spec@1.9.2
  - @contractspec/lib.ui-kit@1.9.2

## 1.9.1

### Patch Changes

- fix
- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.9.1
  - @contractspec/lib.contracts-spec@1.9.1
  - @contractspec/lib.ai-agent@0.2.1
  - @contractspec/lib.ui-kit@1.9.1

## 1.9.0

### Minor Changes

- b1d0876: Managed platform

### Patch Changes

- Updated dependencies [b1d0876]
  - @contractspec/lib.ui-kit-web@1.9.0
  - @contractspec/lib.contracts-spec@1.9.0
  - @contractspec/lib.ai-agent@0.2.0
  - @contractspec/lib.ui-kit@1.9.0

## 1.8.0

### Minor Changes

- f1f4ddd: Foundation Hardening

### Patch Changes

- Updated dependencies [f1f4ddd]
  - @contractspec/lib.ui-kit-web@1.8.0
  - @contractspec/lib.contracts-spec@1.8.0
  - @contractspec/lib.ui-kit@1.8.0

## 1.7.4

### Patch Changes

- fix typing
- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.7.4
  - @contractspec/lib.contracts-spec@1.7.4
  - @contractspec/lib.ui-kit@1.7.4

## 1.7.3

### Patch Changes

- add right-sidebar
- Updated dependencies
  - @contractspec/lib.contracts-spec@1.7.3
  - @contractspec/lib.ui-kit@1.7.3
  - @contractspec/lib.ui-kit-web@1.7.3

## 1.7.2

### Patch Changes

- fix typing
- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.7.2
  - @contractspec/lib.contracts-spec@1.7.2
  - @contractspec/lib.ui-kit@1.7.2

## 1.7.1

### Patch Changes

- fix typing
- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.7.1
  - @contractspec/lib.contracts-spec@1.7.1
  - @contractspec/lib.ui-kit@1.7.1

## 1.7.0

### Minor Changes

- fixii

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.7.0
  - @contractspec/lib.contracts-spec@1.7.0
  - @contractspec/lib.ui-kit@1.7.0

## 1.6.0

### Minor Changes

- fix versionnnn

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.6.0
  - @contractspec/lib.contracts-spec@1.6.0
  - @contractspec/lib.ui-kit@1.6.0

## 1.5.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.5.0
  - @contractspec/lib.contracts-spec@1.5.0
  - @contractspec/lib.ui-kit@1.5.0

## 1.4.0

### Minor Changes

- fix exports

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.4.0
  - @contractspec/lib.contracts-spec@1.4.0
  - @contractspec/lib.ui-kit@1.4.0

## 1.3.0

### Minor Changes

- fix it

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.3.0
  - @contractspec/lib.contracts-spec@1.3.0
  - @contractspec/lib.ui-kit@1.3.0

## 1.2.0

### Minor Changes

- fix

### Patch Changes

- Updated dependencies
  - @contractspec/lib.ui-kit-web@1.2.0
  - @contractspec/lib.contracts-spec@1.2.0
  - @contractspec/lib.ui-kit@1.2.0

## 1.1.0

### Minor Changes

- fix
- 748b3a2: fix publish

### Patch Changes

- Updated dependencies
- Updated dependencies [748b3a2]
  - @contractspec/lib.contracts-spec@1.1.0
  - @contractspec/lib.ui-kit@1.1.0
  - @contractspec/lib.ui-kit-web@1.1.0

## 1.1.0

### Minor Changes

- eeba130: fix publish

### Patch Changes

- Updated dependencies [eeba130]
  - @contractspec/lib.contracts-spec@1.1.0
  - @contractspec/lib.ui-kit@1.1.0
  - @contractspec/lib.ui-kit-web@1.1.0
