# @contractspec/bundle.library

## 3.9.7

### Patch Changes

- Make the form-only showcase previewable from the templates catalog and restore sandbox routing for non-inline template previews.
  - Packages: @contractspec/example.form-showcase (minor), @contractspec/module.examples (patch), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch)
- Add a form-only example template and public docs links for ContractSpec form adoption.
  - Packages: @contractspec/example.form-showcase (minor), @contractspec/module.examples (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Add grouped option support to design-system Select controls across web and native.
- Updated dependencies because of Make the form-only showcase previewable from the templates catalog and restore sandbox routing for non-inline template previews.
- Updated dependencies because of Add a form-only example template and public docs links for ContractSpec form adoption.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Keep web FormSpec datetime controls inside their responsive form columns.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Preserve FormSpec email input behavior when optional renderer metadata is omitted.
- Updated dependencies because of Add ThemeSpec Tailwind aliases for FormSpec option surface backgrounds.
- Updated dependencies because of Fix FormSpec password visibility toggles so rendered password fields can reveal and re-mask values.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
- Updated dependencies because of Forward refs through the web Button primitive and its slotted rendering path to stabilize Radix `asChild` triggers.
  - @contractspec/bundle.workspace@4.5.5
  - @contractspec/example.data-grid-showcase@3.8.19
  - @contractspec/lib.ai-providers@3.7.18
  - @contractspec/lib.content-gen@3.7.25
  - @contractspec/lib.contracts-integrations@3.8.17
  - @contractspec/lib.contracts-library@3.7.25
  - @contractspec/lib.contracts-runtime-server-graphql@3.8.4
  - @contractspec/lib.contracts-runtime-server-mcp@3.8.5
  - @contractspec/lib.contracts-runtime-server-rest@3.8.4
  - @contractspec/lib.example-shared-ui@7.0.4
  - @contractspec/lib.knowledge@3.8.1
  - @contractspec/lib.logger@3.7.18
  - @contractspec/lib.provider-ranking@0.7.18
  - @contractspec/lib.runtime-sandbox@3.0.4
  - @contractspec/lib.surface-runtime@0.5.25
  - @contractspec/lib.ui-link@3.7.20
  - @contractspec/module.context-storage@0.7.24
  - @contractspec/lib.contracts-spec@6.0.0
  - @contractspec/lib.design-system@4.2.0
  - @contractspec/module.examples@4.0.4
  - @contractspec/lib.contracts-runtime-client-react@3.12.0
  - @contractspec/lib.ui-kit-web@3.13.0

## 3.9.6

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
- Updated dependencies because of Complete the knowledge OSS surface with stricter guardrails and an easier runtime path.

`@contractspec/lib.knowledge` now exposes a higher-level `KnowledgeRuntime` helper for the common ingest -> retrieve -> answer flow, adds per-query overrides on `KnowledgeQueryService`, and makes typed retrieval filters (`locale`, `category`) real rather than documentation-only. The access guard now enforces `automationWritable` and denies missing workflow/agent bindings when scoped allow-lists exist, which aligns runtime behavior with the contracts-spec knowledge semantics. The package also gains deeper regression coverage over previously untested public primitives.

`@contractspec/example.knowledge-canon` now demonstrates a real `lib.knowledge` retrieval path instead of a placeholder TODO, so OSS consumers have a concrete example package they can reuse.

- @contractspec/bundle.workspace@4.5.4
- @contractspec/example.data-grid-showcase@3.8.18
- @contractspec/lib.ai-providers@3.7.17
- @contractspec/lib.content-gen@3.7.24
- @contractspec/lib.contracts-integrations@3.8.16
- @contractspec/lib.contracts-library@3.7.24
- @contractspec/lib.contracts-runtime-server-graphql@3.8.3
- @contractspec/lib.contracts-runtime-server-mcp@3.8.4
- @contractspec/lib.contracts-runtime-server-rest@3.8.3
- @contractspec/lib.example-shared-ui@7.0.3
- @contractspec/lib.logger@3.7.17
- @contractspec/lib.provider-ranking@0.7.17
- @contractspec/lib.runtime-sandbox@3.0.3
- @contractspec/lib.surface-runtime@0.5.24
- @contractspec/lib.ui-link@3.7.19
- @contractspec/module.context-storage@0.7.23
- @contractspec/module.examples@4.0.3
- @contractspec/lib.ui-kit-web@3.12.1
- @contractspec/lib.design-system@4.1.0
- @contractspec/lib.contracts-spec@5.7.0
- @contractspec/lib.contracts-runtime-client-react@3.11.1
- @contractspec/lib.knowledge@3.8.0

## 3.9.5

### Patch Changes

- Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
  - Packages: @contractspec/lib.design-system (major), @contractspec/lib.presentation-runtime-core (patch), @contractspec/bundle.library (patch)
  - Migration: Move direct design-system platform imports from `.mobile` to `.native`.
  - Deprecations: Direct imports such as `@contractspec/lib.design-system/components/molecules/Tabs.mobile` have been replaced by `.native` subpaths.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add Biome guardrails that keep JSX layout and text compatible with React and React Native.
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
- Updated dependencies because of Migrate design-system platform implementation suffixes from `.mobile` to `.native`.
- Updated dependencies because of Harden published cross-platform UI packages around precise public subpath imports and closed native dist graphs.
- Updated dependencies because of Use shared stack layout primitives in the web pagination component while preserving semantic pagination markup.
- Updated dependencies because of Add a unified design-system Tabs primitive and migrate local tab consumers away from ui-kit leaf imports.
  - @contractspec/bundle.workspace@4.5.3
  - @contractspec/lib.ai-providers@3.7.16
  - @contractspec/lib.content-gen@3.7.23
  - @contractspec/lib.contracts-integrations@3.8.15
  - @contractspec/lib.contracts-library@3.7.23
  - @contractspec/lib.contracts-runtime-server-graphql@3.8.2
  - @contractspec/lib.contracts-runtime-server-mcp@3.8.3
  - @contractspec/lib.contracts-runtime-server-rest@3.8.2
  - @contractspec/lib.example-shared-ui@7.0.2
  - @contractspec/lib.knowledge@3.7.23
  - @contractspec/lib.logger@3.7.16
  - @contractspec/lib.provider-ranking@0.7.16
  - @contractspec/lib.runtime-sandbox@3.0.2
  - @contractspec/lib.surface-runtime@0.5.23
  - @contractspec/lib.ui-link@3.7.18
  - @contractspec/module.context-storage@0.7.22
  - @contractspec/module.examples@4.0.2
  - @contractspec/lib.ui-kit-web@3.12.0
  - @contractspec/lib.design-system@4.0.0
  - @contractspec/lib.contracts-spec@5.6.0
  - @contractspec/lib.contracts-runtime-client-react@3.11.0
  - @contractspec/example.data-grid-showcase@3.8.17
  - @contractspec/lib.schema@3.7.14

## 3.9.4

### Patch Changes

- Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - Packages: contractspec (patch), @contractspec/app.web-landing (patch), @contractspec/bundle.library (patch), @contractspec/lib.contracts-spec (patch), @contractspec/tool.bun (patch), @contractspec/tool.docs-generator (patch), @contractspec/biome-config (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
- Updated dependencies because of Centralize repeated dependency specs through Bun catalogs and align React Hook Form/Zod resolver types after dependency upgrades.
  - @contractspec/bundle.workspace@4.5.2
  - @contractspec/example.data-grid-showcase@3.8.16
  - @contractspec/lib.ai-providers@3.7.15
  - @contractspec/lib.content-gen@3.7.22
  - @contractspec/lib.contracts-integrations@3.8.14
  - @contractspec/lib.contracts-library@3.7.22
  - @contractspec/lib.contracts-runtime-server-graphql@3.8.1
  - @contractspec/lib.contracts-runtime-server-mcp@3.8.2
  - @contractspec/lib.contracts-runtime-server-rest@3.8.1
  - @contractspec/lib.example-shared-ui@7.0.1
  - @contractspec/lib.knowledge@3.7.22
  - @contractspec/lib.logger@3.7.15
  - @contractspec/lib.provider-ranking@0.7.15
  - @contractspec/lib.runtime-sandbox@3.0.1
  - @contractspec/lib.surface-runtime@0.5.22
  - @contractspec/lib.ui-link@3.7.17
  - @contractspec/module.context-storage@0.7.21
  - @contractspec/module.examples@4.0.1
  - @contractspec/lib.contracts-spec@5.5.1
  - @contractspec/lib.contracts-runtime-client-react@3.10.2
  - @contractspec/lib.design-system@3.11.2
  - @contractspec/lib.ui-kit-web@3.11.1
  - @contractspec/lib.schema@3.7.14

## 3.9.3

### Patch Changes

- Promote the Expo demo Examples surface to first-class navigation and reuse shared preview components so mobile and web example previews stay aligned.
  - Packages: @contractspec/app.expo-demo (patch), @contractspec/app.web-landing (patch), @contractspec/bundle.library (patch), @contractspec/bundle.marketing (patch), @contractspec/example.agent-console (patch), @contractspec/module.examples (minor)
  - Migration: Rich example previews should reuse cross-platform components through the UI kit alias layer before falling back to app-local native summaries.
- Split example discovery from rich runtime packages so lightweight consumers no longer install every ContractSpec example.
  - Packages: @contractspec/module.examples (major), @contractspec/app.cli-contractspec (minor), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch)
  - Migration: Replace runtime imports such as `TemplateRuntimeProvider`, `listTemplates`, and inline preview loaders from `@contractspec/module.examples` with `@contractspec/module.examples/runtime`.; Import `listExamples`, `getExample`, `searchExamples`, route helpers, and source metadata from `@contractspec/module.examples/catalog` when runnable example code is not needed.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Reduce published install and bundle size by optionalizing heavy runtime families and adding a repo dependency audit.
- Updated dependencies because of Promote the Expo demo Examples surface to first-class navigation and reuse shared preview components so mobile and web example previews stay aligned.
- Updated dependencies because of Split example discovery from rich runtime packages so lightweight consumers no longer install every ContractSpec example.
  - @contractspec/example.data-grid-showcase@3.8.15
  - @contractspec/lib.contracts-runtime-client-react@3.10.1
  - @contractspec/lib.contracts-runtime-server-mcp@3.8.1
  - @contractspec/lib.design-system@3.11.1
  - @contractspec/lib.runtime-sandbox@3.0.0
  - @contractspec/lib.example-shared-ui@7.0.0
  - @contractspec/lib.ui-kit-web@3.11.0
  - @contractspec/module.examples@4.0.0
  - @contractspec/bundle.workspace@4.5.1
  - @contractspec/lib.ai-providers@3.7.14
  - @contractspec/lib.content-gen@3.7.21
  - @contractspec/lib.contracts-integrations@3.8.13
  - @contractspec/lib.contracts-library@3.7.21
  - @contractspec/lib.contracts-runtime-server-graphql@3.8.0
  - @contractspec/lib.contracts-runtime-server-rest@3.8.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.knowledge@3.7.21
  - @contractspec/lib.logger@3.7.14
  - @contractspec/lib.provider-ranking@0.7.14
  - @contractspec/lib.schema@3.7.14
  - @contractspec/lib.surface-runtime@0.5.21
  - @contractspec/lib.ui-link@3.7.16
  - @contractspec/module.context-storage@0.7.20

## 3.9.2

### Patch Changes

- Restore the public web-landing templates and examples surfaces so non-internal examples render in the templates catalog, docs routes, sitemap, and sandbox fallback previews.
  - Packages: @contractspec/module.examples (minor), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add focused design-system subpaths and harden ThemeSpec runtime, Tailwind bridge, form-control helpers, and form renderer internals without changing root-import compatibility.
- Updated dependencies because of Add a ThemeSpec-aware and TranslationSpec-aware design-system form/control layer with stack primitives, exported control wrappers, and FormSpec renderer alignment.
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Keep design-system FormRender mobile-safe by preserving shared renderer imports for Metro aliases and hardening generated package artifacts.
- Updated dependencies because of Restore the public web-landing templates and examples surfaces so non-internal examples render in the templates catalog, docs routes, sitemap, and sandbox fallback previews.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/bundle.workspace@4.5.1
  - @contractspec/lib.ai-providers@3.7.14
  - @contractspec/lib.content-gen@3.7.21
  - @contractspec/lib.contracts-integrations@3.8.13
  - @contractspec/lib.contracts-library@3.7.21
  - @contractspec/lib.example-shared-ui@6.0.22
  - @contractspec/lib.knowledge@3.7.21
  - @contractspec/lib.logger@3.7.14
  - @contractspec/lib.provider-ranking@0.7.14
  - @contractspec/lib.runtime-sandbox@2.7.15
  - @contractspec/lib.surface-runtime@0.5.21
  - @contractspec/lib.ui-link@3.7.16
  - @contractspec/module.context-storage@0.7.20
  - @contractspec/lib.design-system@3.11.0
  - @contractspec/lib.contracts-spec@5.5.0
  - @contractspec/lib.contracts-runtime-client-react@3.10.0
  - @contractspec/lib.ui-kit-web@3.10.3
  - @contractspec/module.examples@3.10.0
  - @contractspec/lib.contracts-runtime-server-rest@3.8.0
  - @contractspec/lib.contracts-runtime-server-graphql@3.8.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.8.0
  - @contractspec/lib.schema@3.7.14

## 3.9.1

### Patch Changes

- Add a dedicated cross-platform UI docs page that explains how the React, React Native, runtime, primitive UI, and design-system layers stay compatible.
  - Packages: @contractspec/bundle.library (patch)
- Updated dependencies because of chore: auto-bump internal dependents
  - @contractspec/lib.contracts-runtime-client-react@3.9.2
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.21
  - @contractspec/lib.design-system@3.10.1
  - @contractspec/lib.example-shared-ui@6.0.21
  - @contractspec/lib.ui-kit-web@3.10.2
  - @contractspec/module.examples@3.9.1

## 3.9.0

### Minor Changes

- Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/module.workspace (minor), @contractspec/bundle.workspace (minor), @contractspec/bundle.library (minor), @contractspec/app.cli-contractspec (minor), vscode-contractspec (minor), contractspec (patch), @contractspec/lib.knowledge (patch), @contractspec/biome-config (patch), @contractspec/app.cursor-marketplace (patch)
  - Migration: ContractSpec workspaces can now opt into family-aware reuse guidance and local catalog sync through `connect.adoption`.; Shared workspace discovery and IDE/CLI create flows now recognize additional contract families beyond the original core set.
- Add a CLI-first onboarding workflow that reuses Connect adoption guidance, models guided onboarding through the surface runtime, generates managed AGENTS/USAGE guides, and exposes the same onboarding tracks through the CLI MCP surface and docs entrypoints.
  - Packages: @contractspec/app.cli-contractspec (minor), @contractspec/bundle.workspace (minor), @contractspec/bundle.library (minor)
  - Migration: The CLI now provides a first-class onboarding command that should replace ad hoc “quickstart + create one spec” repo bootstraps.; `contractspec init` can now create or merge a managed `USAGE.md` section in addition to `AGENTS.md`.

### Patch Changes

- Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
  - Packages: contractspec (patch), @contractspec/lib.contracts-spec (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch)
- Unify example preview metadata so templates and docs derive inline preview support from shared example registry data instead of hand-maintained lists.
  - Packages: @contractspec/module.examples (minor), @contractspec/bundle.marketing (patch), @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch), @contractspec/example.agent-console (patch), @contractspec/example.ai-chat-assistant (patch), @contractspec/example.analytics-dashboard (patch), @contractspec/example.crm-pipeline (patch), @contractspec/example.integration-hub (patch), @contractspec/example.learning-journey-registry (patch), @contractspec/example.marketplace (patch), @contractspec/example.policy-safe-knowledge-assistant (patch), @contractspec/example.saas-boilerplate (patch), @contractspec/example.workflow-system (patch)
  - Migration: Any published example that exports `./ui` should also advertise that UI surface in its `ExampleSpec` entrypoints so preview tooling can discover it.
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Fix Builder local onboarding so setup writes usable control-plane defaults and the CLI resolves Builder API settings from workspace config.
- Updated dependencies because of Unify release authoring around guided capsules, canonical generated artifacts, and manifest-backed changelog surfaces.
- Updated dependencies because of Add a CLI-first onboarding workflow that reuses Connect adoption guidance, models guided onboarding through the surface runtime, generates managed AGENTS/USAGE guides, and exposes the same onboarding tracks through the CLI MCP surface and docs entrypoints.
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Harden the shared data-table stack and add a first-class composed toolbar for search, filter chips, selection summary, and hidden-column recovery.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
- Updated dependencies because of Redesign the learning system around the adaptive journey runtime and repair shared learning sandbox presentation wiring.
- Updated dependencies because of Unify example preview metadata so templates and docs derive inline preview support from shared example registry data instead of hand-maintained lists.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/bundle.workspace@4.5.0
  - @contractspec/lib.knowledge@3.7.20
  - @contractspec/lib.content-gen@3.7.20
  - @contractspec/lib.contracts-integrations@3.8.12
  - @contractspec/lib.contracts-library@3.7.20
  - @contractspec/lib.contracts-runtime-client-react@3.9.1
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.20
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.20
  - @contractspec/lib.contracts-runtime-server-rest@3.7.20
  - @contractspec/lib.example-shared-ui@6.0.20
  - @contractspec/lib.surface-runtime@0.5.20
  - @contractspec/module.context-storage@0.7.19
  - @contractspec/lib.design-system@3.10.0
  - @contractspec/lib.ui-kit-web@3.10.1
  - @contractspec/module.examples@3.9.0

## 3.8.12

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.contracts-runtime-client-react@3.9.0
  - @contractspec/lib.design-system@3.9.0
  - @contractspec/lib.ui-kit-web@3.10.0
  - @contractspec/lib.content-gen@3.7.19
  - @contractspec/lib.contracts-integrations@3.8.11
  - @contractspec/lib.contracts-library@3.7.19
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.19
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.19
  - @contractspec/lib.contracts-runtime-server-rest@3.7.19
  - @contractspec/lib.example-shared-ui@6.0.19
  - @contractspec/lib.knowledge@3.7.19
  - @contractspec/lib.surface-runtime@0.5.19
  - @contractspec/module.examples@3.8.11
  - @contractspec/lib.ui-link@3.7.15
  - @contractspec/module.context-storage@0.7.18

## 3.8.11

### Patch Changes

- Harden the Builder rollout with canonical bootstrap presets, channel-heavy mobile review flows, local-daemon runtime registration, and richer operator status surfaces.
  - Packages: @contractspec/lib.builder-spec (minor), @contractspec/lib.builder-runtime (minor), @contractspec/lib.mobile-control (minor), @contractspec/lib.provider-runtime (minor), @contractspec/module.builder-workbench (minor), @contractspec/module.mobile-review (minor), @contractspec/integration.runtime.local (minor), @contractspec/integration.provider.gemini (minor), @contractspec/app.cli-contractspec (minor), @contractspec/bundle.library (patch)
- Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - Packages: @contractspec/lib.contracts-spec (minor), @contractspec/bundle.workspace (minor), @contractspec/app.cli-contractspec (minor), @contractspec/bundle.library (patch), agentpacks (minor)
  - Migration: Turn on the Connect adapter flow before relying on task-scoped context, review, replay, or evaluation artifacts.
- Expand the spec-pack docs into a fuller learning path across the public docs site.
  - Packages: @contractspec/bundle.library (patch), @contractspec/app.web-landing (patch)
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
- Updated dependencies because of Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - @contractspec/lib.content-gen@3.7.18
  - @contractspec/lib.contracts-integrations@3.8.10
  - @contractspec/lib.contracts-library@3.7.18
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.18
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.18
  - @contractspec/lib.contracts-runtime-server-rest@3.7.18
  - @contractspec/lib.knowledge@3.7.18
  - @contractspec/module.context-storage@0.7.17
  - @contractspec/lib.contracts-spec@5.2.0
  - @contractspec/lib.contracts-runtime-client-react@3.8.6
  - @contractspec/lib.design-system@3.8.11
  - @contractspec/lib.example-shared-ui@6.0.18
  - @contractspec/lib.surface-runtime@0.5.18
  - @contractspec/lib.ui-kit-web@3.9.10
  - @contractspec/lib.ui-link@3.7.14
  - @contractspec/module.examples@3.8.10
  - @contractspec/lib.ai-providers@3.7.13
  - @contractspec/lib.logger@3.7.13
  - @contractspec/lib.provider-ranking@0.7.13
  - @contractspec/lib.runtime-sandbox@2.7.14
  - @contractspec/lib.schema@3.7.14

## 3.8.10

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.17
  - @contractspec/lib.contracts-runtime-client-react@3.8.5
  - @contractspec/lib.contracts-runtime-server-rest@3.7.17
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.17
  - @contractspec/lib.contracts-integrations@3.8.9
  - @contractspec/module.context-storage@0.7.16
  - @contractspec/lib.contracts-library@3.7.17
  - @contractspec/lib.example-shared-ui@6.0.17
  - @contractspec/lib.provider-ranking@0.7.13
  - @contractspec/lib.runtime-sandbox@2.7.14
  - @contractspec/lib.surface-runtime@0.5.17
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.design-system@3.8.10
  - @contractspec/lib.ai-providers@3.7.13
  - @contractspec/lib.content-gen@3.7.17
  - @contractspec/module.examples@3.8.9
  - @contractspec/lib.ui-kit-web@3.9.9
  - @contractspec/lib.knowledge@3.7.17
  - @contractspec/lib.ui-link@3.7.13
  - @contractspec/lib.logger@3.7.13
  - @contractspec/lib.schema@3.7.14

## 3.8.9

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.16
  - @contractspec/lib.contracts-runtime-client-react@3.8.4
  - @contractspec/lib.contracts-runtime-server-rest@3.7.16
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.16
  - @contractspec/lib.contracts-integrations@3.8.8
  - @contractspec/module.context-storage@0.7.15
  - @contractspec/lib.contracts-library@3.7.16
  - @contractspec/lib.example-shared-ui@6.0.16
  - @contractspec/lib.provider-ranking@0.7.12
  - @contractspec/lib.runtime-sandbox@2.7.13
  - @contractspec/lib.surface-runtime@0.5.16
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.design-system@3.8.9
  - @contractspec/lib.ai-providers@3.7.12
  - @contractspec/lib.content-gen@3.7.16
  - @contractspec/module.examples@3.8.8
  - @contractspec/lib.ui-kit-web@3.9.8
  - @contractspec/lib.knowledge@3.7.16
  - @contractspec/lib.ui-link@3.7.12
  - @contractspec/lib.logger@3.7.12
  - @contractspec/lib.schema@3.7.13

## 3.8.8

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.15
  - @contractspec/lib.contracts-runtime-client-react@3.8.3
  - @contractspec/lib.contracts-runtime-server-rest@3.7.15
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.15
  - @contractspec/lib.contracts-integrations@3.8.7
  - @contractspec/module.context-storage@0.7.14
  - @contractspec/lib.contracts-library@3.7.15
  - @contractspec/lib.example-shared-ui@6.0.15
  - @contractspec/lib.provider-ranking@0.7.11
  - @contractspec/lib.runtime-sandbox@2.7.12
  - @contractspec/lib.surface-runtime@0.5.15
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.design-system@3.8.8
  - @contractspec/lib.ai-providers@3.7.11
  - @contractspec/lib.content-gen@3.7.15
  - @contractspec/module.examples@3.8.7
  - @contractspec/lib.ui-kit-web@3.9.7
  - @contractspec/lib.knowledge@3.7.15
  - @contractspec/lib.ui-link@3.7.11
  - @contractspec/lib.logger@3.7.11
  - @contractspec/lib.schema@3.7.12

## 3.8.7

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.14
  - @contractspec/lib.contracts-runtime-client-react@3.8.2
  - @contractspec/lib.contracts-runtime-server-rest@3.7.14
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.14
  - @contractspec/lib.contracts-integrations@3.8.6
  - @contractspec/module.context-storage@0.7.13
  - @contractspec/lib.contracts-library@3.7.14
  - @contractspec/lib.example-shared-ui@6.0.14
  - @contractspec/lib.provider-ranking@0.7.10
  - @contractspec/lib.runtime-sandbox@2.7.11
  - @contractspec/lib.surface-runtime@0.5.14
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.design-system@3.8.7
  - @contractspec/lib.ai-providers@3.7.10
  - @contractspec/lib.content-gen@3.7.14
  - @contractspec/module.examples@3.8.6
  - @contractspec/lib.ui-kit-web@3.9.6
  - @contractspec/lib.knowledge@3.7.14
  - @contractspec/lib.ui-link@3.7.10
  - @contractspec/lib.logger@3.7.10
  - @contractspec/lib.schema@3.7.11

## 3.8.6

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.content-gen@3.7.13
  - @contractspec/lib.contracts-integrations@3.8.5
  - @contractspec/lib.contracts-library@3.7.13
  - @contractspec/lib.contracts-runtime-client-react@3.8.1
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.13
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.13
  - @contractspec/lib.contracts-runtime-server-rest@3.7.13
  - @contractspec/lib.design-system@3.8.6
  - @contractspec/lib.example-shared-ui@6.0.13
  - @contractspec/lib.knowledge@3.7.13
  - @contractspec/lib.surface-runtime@0.5.13
  - @contractspec/lib.ui-kit-web@3.9.5
  - @contractspec/module.examples@3.8.5
  - @contractspec/module.context-storage@0.7.13

## 3.8.5

### Patch Changes

- 03724cf: Normalize MCP POST Accept headers for JSON-only clients so MCP prompt and tool calls do not fail with a 406 when the client omits `text/event-stream`.

## 3.8.4

### Patch Changes

- 81256ea: Split agent definition contracts out of `@contractspec/lib.ai-agent` and make
  `@contractspec/lib.contracts-spec` the source of truth for agent declaration APIs.

  Major changes:

  - Move `AgentSpec`, `AgentToolConfig`, `AgentPolicy`, `AgentRegistry`,
    `createAgentRegistry`, `defineAgent`, and related definition-only types into
    `@contractspec/lib.contracts-spec/agent`.
  - Add `@contractspec/lib.contracts-spec/agent/spec` and
    `@contractspec/lib.contracts-spec/agent/registry` export subpaths.
  - Remove `@contractspec/lib.ai-agent/spec`,
    `@contractspec/lib.ai-agent/spec/spec`, and
    `@contractspec/lib.ai-agent/spec/registry`.
  - Remove the spec layer from the `@contractspec/lib.ai-agent` root barrel so it
    is runtime-focused.

  Workspace consumers were migrated to import agent-definition contracts from
  `@contractspec/lib.contracts-spec/agent`, and packages that only needed the
  contract layer dropped their direct dependency on `@contractspec/lib.ai-agent`.

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [6de2f1c]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.contracts-runtime-client-react@3.8.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.12
  - @contractspec/lib.contracts-integrations@3.8.4
  - @contractspec/lib.schema@3.7.10
  - @contractspec/lib.content-gen@3.7.12
  - @contractspec/lib.contracts-library@3.7.12
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.12
  - @contractspec/lib.contracts-runtime-server-rest@3.7.12
  - @contractspec/lib.design-system@3.8.5
  - @contractspec/lib.example-shared-ui@6.0.12
  - @contractspec/lib.knowledge@3.7.12
  - @contractspec/lib.surface-runtime@0.5.12
  - @contractspec/lib.ui-kit-web@3.9.4
  - @contractspec/module.examples@3.8.4
  - @contractspec/module.context-storage@0.7.12

## 3.8.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.11
  - @contractspec/lib.contracts-runtime-server-rest@3.7.11
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.11
  - @contractspec/lib.contracts-integrations@3.8.3
  - @contractspec/module.context-storage@0.7.11
  - @contractspec/lib.contracts-library@3.7.11
  - @contractspec/lib.example-shared-ui@6.0.11
  - @contractspec/lib.provider-ranking@0.7.9
  - @contractspec/lib.runtime-sandbox@2.7.10
  - @contractspec/lib.surface-runtime@0.5.11
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.design-system@3.8.4
  - @contractspec/lib.ai-providers@3.7.9
  - @contractspec/lib.content-gen@3.7.11
  - @contractspec/module.examples@3.8.3
  - @contractspec/lib.ui-kit-web@3.9.3
  - @contractspec/lib.knowledge@3.7.11
  - @contractspec/lib.ui-link@3.7.9
  - @contractspec/lib.logger@3.7.9
  - @contractspec/lib.schema@3.7.9

## 3.8.2

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.10
  - @contractspec/lib.contracts-runtime-server-rest@3.7.10
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.10
  - @contractspec/lib.contracts-integrations@3.8.2
  - @contractspec/module.context-storage@0.7.10
  - @contractspec/lib.contracts-library@3.7.10
  - @contractspec/lib.example-shared-ui@6.0.10
  - @contractspec/lib.provider-ranking@0.7.8
  - @contractspec/lib.runtime-sandbox@2.7.9
  - @contractspec/lib.surface-runtime@0.5.10
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.design-system@3.8.3
  - @contractspec/lib.ai-providers@3.7.8
  - @contractspec/lib.content-gen@3.7.10
  - @contractspec/module.examples@3.8.2
  - @contractspec/lib.ui-kit-web@3.9.2
  - @contractspec/lib.knowledge@3.7.10
  - @contractspec/lib.ui-link@3.7.8
  - @contractspec/lib.logger@3.7.8
  - @contractspec/lib.schema@3.7.8

## 3.8.1

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.9
  - @contractspec/lib.contracts-runtime-server-rest@3.7.9
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.9
  - @contractspec/lib.contracts-integrations@3.8.1
  - @contractspec/module.context-storage@0.7.9
  - @contractspec/lib.contracts-library@3.7.9
  - @contractspec/lib.example-shared-ui@6.0.9
  - @contractspec/lib.runtime-sandbox@2.7.8
  - @contractspec/lib.surface-runtime@0.5.9
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.design-system@3.8.2
  - @contractspec/lib.content-gen@3.7.9
  - @contractspec/module.examples@3.8.1
  - @contractspec/lib.ui-kit-web@3.9.1
  - @contractspec/lib.knowledge@3.7.9
  - @contractspec/lib.ui-link@3.7.7
  - @contractspec/lib.ai-providers@3.7.7
  - @contractspec/lib.logger@3.7.7
  - @contractspec/lib.provider-ranking@0.7.7
  - @contractspec/lib.schema@3.7.7

## 3.7.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.6
  - @contractspec/lib.contracts-runtime-server-rest@3.7.6
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.6
  - @contractspec/lib.contracts-integrations@3.7.6
  - @contractspec/module.context-storage@0.7.6
  - @contractspec/lib.contracts-library@3.7.6
  - @contractspec/lib.example-shared-ui@6.0.6
  - @contractspec/lib.provider-ranking@0.7.6
  - @contractspec/lib.runtime-sandbox@2.7.6
  - @contractspec/lib.surface-runtime@0.5.6
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.design-system@3.7.6
  - @contractspec/lib.ai-providers@3.7.6
  - @contractspec/lib.content-gen@3.7.6
  - @contractspec/module.examples@3.7.6
  - @contractspec/lib.ui-kit-web@3.7.6
  - @contractspec/lib.knowledge@3.7.6
  - @contractspec/lib.ui-link@3.7.6
  - @contractspec/lib.logger@3.7.6
  - @contractspec/lib.schema@3.7.6

## 3.7.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.5
  - @contractspec/lib.contracts-runtime-server-rest@3.7.5
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.5
  - @contractspec/lib.contracts-integrations@3.7.5
  - @contractspec/module.context-storage@0.7.5
  - @contractspec/lib.contracts-library@3.7.5
  - @contractspec/lib.example-shared-ui@6.0.5
  - @contractspec/lib.provider-ranking@0.7.5
  - @contractspec/lib.runtime-sandbox@2.7.5
  - @contractspec/lib.surface-runtime@0.5.5
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.design-system@3.7.5
  - @contractspec/lib.ai-providers@3.7.5
  - @contractspec/lib.content-gen@3.7.5
  - @contractspec/module.examples@3.7.5
  - @contractspec/lib.ui-kit-web@3.7.5
  - @contractspec/lib.knowledge@3.7.5
  - @contractspec/lib.ui-link@3.7.5
  - @contractspec/lib.logger@3.7.5
  - @contractspec/lib.schema@3.7.5

## 3.7.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.4
  - @contractspec/lib.contracts-runtime-server-rest@3.7.4
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.4
  - @contractspec/lib.contracts-integrations@3.7.4
  - @contractspec/module.context-storage@0.7.4
  - @contractspec/lib.contracts-library@3.7.4
  - @contractspec/lib.example-shared-ui@6.0.4
  - @contractspec/lib.provider-ranking@0.7.4
  - @contractspec/lib.runtime-sandbox@2.7.4
  - @contractspec/lib.surface-runtime@0.5.4
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.design-system@3.7.4
  - @contractspec/lib.ai-providers@3.7.4
  - @contractspec/lib.content-gen@3.7.4
  - @contractspec/module.examples@3.7.4
  - @contractspec/lib.ui-kit-web@3.7.4
  - @contractspec/lib.knowledge@3.7.4
  - @contractspec/lib.ui-link@3.7.4
  - @contractspec/lib.logger@3.7.4
  - @contractspec/lib.schema@3.7.4

## 3.7.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.3
  - @contractspec/lib.contracts-runtime-server-rest@3.7.3
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.3
  - @contractspec/lib.contracts-integrations@3.7.3
  - @contractspec/module.context-storage@0.7.3
  - @contractspec/lib.contracts-library@3.7.3
  - @contractspec/lib.example-shared-ui@6.0.3
  - @contractspec/lib.provider-ranking@0.7.3
  - @contractspec/lib.runtime-sandbox@2.7.3
  - @contractspec/lib.surface-runtime@0.5.3
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.design-system@3.7.3
  - @contractspec/lib.ai-providers@3.7.3
  - @contractspec/lib.content-gen@3.7.3
  - @contractspec/module.examples@3.7.3
  - @contractspec/lib.ui-kit-web@3.7.3
  - @contractspec/lib.knowledge@3.7.3
  - @contractspec/lib.ui-link@3.7.3
  - @contractspec/lib.logger@3.7.3
  - @contractspec/lib.schema@3.7.3

## 3.7.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.2
  - @contractspec/lib.contracts-runtime-server-rest@3.7.2
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.2
  - @contractspec/lib.contracts-integrations@3.7.2
  - @contractspec/module.context-storage@0.7.2
  - @contractspec/lib.contracts-library@3.7.2
  - @contractspec/lib.example-shared-ui@6.0.2
  - @contractspec/lib.provider-ranking@0.7.2
  - @contractspec/lib.runtime-sandbox@2.7.2
  - @contractspec/lib.surface-runtime@0.5.2
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.design-system@3.7.2
  - @contractspec/lib.ai-providers@3.7.2
  - @contractspec/lib.content-gen@3.7.2
  - @contractspec/module.examples@3.7.2
  - @contractspec/lib.ui-kit-web@3.7.2
  - @contractspec/lib.knowledge@3.7.2
  - @contractspec/lib.ui-link@3.7.2
  - @contractspec/lib.logger@3.7.2
  - @contractspec/lib.schema@3.7.2

## 3.7.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.1
  - @contractspec/lib.contracts-runtime-server-rest@3.7.1
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.1
  - @contractspec/lib.contracts-integrations@3.7.1
  - @contractspec/module.context-storage@0.7.1
  - @contractspec/lib.contracts-library@3.7.1
  - @contractspec/lib.example-shared-ui@6.0.1
  - @contractspec/lib.provider-ranking@0.7.1
  - @contractspec/lib.runtime-sandbox@2.7.1
  - @contractspec/lib.surface-runtime@0.5.1
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.design-system@3.7.1
  - @contractspec/lib.ai-providers@3.7.1
  - @contractspec/lib.content-gen@3.7.1
  - @contractspec/module.examples@3.7.1
  - @contractspec/lib.ui-kit-web@3.7.1
  - @contractspec/lib.knowledge@3.7.1
  - @contractspec/lib.ui-link@3.7.1
  - @contractspec/lib.logger@3.7.1
  - @contractspec/lib.schema@3.7.1

## 3.7.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-runtime-server-graphql@3.7.0
  - @contractspec/lib.contracts-runtime-server-rest@3.7.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.7.0
  - @contractspec/lib.contracts-integrations@3.7.0
  - @contractspec/module.context-storage@0.7.0
  - @contractspec/lib.contracts-library@3.7.0
  - @contractspec/lib.example-shared-ui@6.0.0
  - @contractspec/lib.provider-ranking@0.7.0
  - @contractspec/lib.runtime-sandbox@2.7.0
  - @contractspec/lib.surface-runtime@0.5.0
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.design-system@3.7.0
  - @contractspec/lib.ai-providers@3.7.0
  - @contractspec/lib.content-gen@3.7.0
  - @contractspec/module.examples@3.7.0
  - @contractspec/lib.ui-kit-web@3.7.0
  - @contractspec/lib.knowledge@3.7.0
  - @contractspec/lib.ui-link@3.7.0
  - @contractspec/lib.logger@3.7.0
  - @contractspec/lib.schema@3.7.0

## 3.6.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [44b46cd]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/module.examples@3.6.0
  - @contractspec/lib.contracts-runtime-server-graphql@3.6.0
  - @contractspec/lib.contracts-runtime-server-rest@3.6.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.6.0
  - @contractspec/lib.contracts-integrations@3.6.0
  - @contractspec/module.context-storage@0.6.0
  - @contractspec/lib.contracts-library@3.6.0
  - @contractspec/lib.example-shared-ui@5.0.0
  - @contractspec/lib.provider-ranking@0.6.0
  - @contractspec/lib.runtime-sandbox@2.6.0
  - @contractspec/lib.surface-runtime@0.4.0
  - @contractspec/lib.design-system@3.6.0
  - @contractspec/lib.ai-providers@3.6.0
  - @contractspec/lib.content-gen@3.6.0
  - @contractspec/lib.ui-kit-web@3.6.0
  - @contractspec/lib.knowledge@3.6.0
  - @contractspec/lib.ui-link@3.6.0
  - @contractspec/lib.logger@3.6.0
  - @contractspec/lib.schema@3.6.0

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
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.ai-providers@3.5.5
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.contracts-runtime-server-graphql@3.5.5
  - @contractspec/lib.contracts-runtime-server-rest@3.5.5
  - @contractspec/lib.contracts-runtime-server-mcp@3.5.5
  - @contractspec/lib.contracts-integrations@3.5.5
  - @contractspec/module.context-storage@0.5.5
  - @contractspec/lib.contracts-library@3.5.5
  - @contractspec/lib.example-shared-ui@4.0.5
  - @contractspec/lib.provider-ranking@0.5.5
  - @contractspec/lib.runtime-sandbox@2.5.5
  - @contractspec/lib.surface-runtime@0.3.5
  - @contractspec/lib.design-system@3.5.5
  - @contractspec/lib.content-gen@3.5.5
  - @contractspec/module.examples@3.5.5
  - @contractspec/lib.ui-kit-web@3.5.5
  - @contractspec/lib.knowledge@3.5.5
  - @contractspec/lib.ui-link@3.5.5
  - @contractspec/lib.logger@3.5.5
  - @contractspec/lib.schema@3.5.5

## 3.5.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- f5d4816: Standardize MCP tool naming from dot notation to underscore notation for MCP protocol compatibility. Update docs, docblocks, and generated indexes accordingly. Path resolver and fixture updates.
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-runtime-server-graphql@3.5.4
  - @contractspec/lib.contracts-runtime-server-rest@3.5.4
  - @contractspec/lib.contracts-runtime-server-mcp@3.5.4
  - @contractspec/lib.contracts-integrations@3.5.4
  - @contractspec/module.context-storage@0.5.4
  - @contractspec/lib.contracts-library@3.5.4
  - @contractspec/lib.example-shared-ui@4.0.4
  - @contractspec/lib.provider-ranking@0.5.4
  - @contractspec/lib.runtime-sandbox@2.5.4
  - @contractspec/lib.surface-runtime@0.3.4
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.design-system@3.5.4
  - @contractspec/lib.content-gen@3.5.4
  - @contractspec/module.examples@3.5.4
  - @contractspec/lib.ui-kit-web@3.5.4
  - @contractspec/lib.knowledge@3.5.4
  - @contractspec/lib.ui-link@3.5.4
  - @contractspec/lib.logger@3.5.4
  - @contractspec/lib.schema@3.5.4

## 3.5.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-runtime-server-graphql@3.5.3
  - @contractspec/lib.contracts-runtime-server-rest@3.5.3
  - @contractspec/lib.contracts-runtime-server-mcp@3.5.3
  - @contractspec/lib.contracts-integrations@3.5.3
  - @contractspec/module.context-storage@0.5.3
  - @contractspec/lib.contracts-library@3.5.3
  - @contractspec/lib.example-shared-ui@4.0.3
  - @contractspec/lib.provider-ranking@0.5.3
  - @contractspec/lib.runtime-sandbox@2.5.3
  - @contractspec/lib.surface-runtime@0.3.3
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.design-system@3.5.3
  - @contractspec/lib.content-gen@3.5.3
  - @contractspec/module.examples@3.5.3
  - @contractspec/lib.ui-kit-web@3.5.3
  - @contractspec/lib.knowledge@3.5.3
  - @contractspec/lib.ui-link@3.5.3
  - @contractspec/lib.logger@3.5.3
  - @contractspec/lib.schema@3.5.3

## 3.5.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-runtime-server-graphql@3.5.2
  - @contractspec/lib.contracts-runtime-server-rest@3.5.2
  - @contractspec/lib.contracts-runtime-server-mcp@3.5.2
  - @contractspec/lib.contracts-integrations@3.5.2
  - @contractspec/module.context-storage@0.5.2
  - @contractspec/lib.contracts-library@3.5.2
  - @contractspec/lib.example-shared-ui@4.0.2
  - @contractspec/lib.provider-ranking@0.5.2
  - @contractspec/lib.runtime-sandbox@2.5.2
  - @contractspec/lib.surface-runtime@0.3.2
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.design-system@3.5.2
  - @contractspec/lib.content-gen@3.5.2
  - @contractspec/module.examples@3.5.2
  - @contractspec/lib.ui-kit-web@3.5.2
  - @contractspec/lib.knowledge@3.5.2
  - @contractspec/lib.ui-link@3.5.2
  - @contractspec/lib.logger@3.5.2
  - @contractspec/lib.schema@3.5.2

## 3.5.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- 73a7f8d: Regenerate docs-index files and fix GuideNextjsOneEndpointPage.
- Updated dependencies [73a7f8d]
- Updated dependencies [dfff0d4]
- Updated dependencies [73a7f8d]
  - @contractspec/lib.example-shared-ui@4.0.1
  - @contractspec/lib.contracts-runtime-server-graphql@3.5.1
  - @contractspec/lib.contracts-runtime-server-rest@3.5.1
  - @contractspec/lib.contracts-runtime-server-mcp@3.5.1
  - @contractspec/lib.contracts-integrations@3.5.1
  - @contractspec/module.context-storage@0.5.1
  - @contractspec/lib.contracts-library@3.5.1
  - @contractspec/lib.provider-ranking@0.5.1
  - @contractspec/lib.runtime-sandbox@2.5.1
  - @contractspec/lib.surface-runtime@0.3.1
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.design-system@3.5.1
  - @contractspec/lib.content-gen@3.5.1
  - @contractspec/module.examples@3.5.1
  - @contractspec/lib.ui-kit-web@3.5.1
  - @contractspec/lib.knowledge@3.5.1
  - @contractspec/lib.ui-link@3.5.1
  - @contractspec/lib.logger@3.5.1
  - @contractspec/lib.schema@3.5.1

## 3.5.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- 1fa29a0: feat(bundle.library): add LibraryBundle, WorkspaceShellRenderer, bundles export

  - Add LibraryBundle and bundles/index for workspace shell composition
  - Add WorkspaceShellRenderer component for dynamic slot rendering
  - Add @contractspec/lib.surface-runtime dependency

- Updated dependencies [66c51da]
- Updated dependencies [1fa29a0]
- Updated dependencies [230bdf6]
  - @contractspec/lib.example-shared-ui@4.0.0
  - @contractspec/lib.surface-runtime@0.3.0
  - @contractspec/lib.contracts-runtime-server-graphql@3.5.0
  - @contractspec/lib.contracts-runtime-server-rest@3.5.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.5.0
  - @contractspec/lib.contracts-integrations@3.5.0
  - @contractspec/module.context-storage@0.5.0
  - @contractspec/lib.contracts-library@3.5.0
  - @contractspec/lib.provider-ranking@0.5.0
  - @contractspec/lib.runtime-sandbox@2.5.0
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.design-system@3.5.0
  - @contractspec/lib.content-gen@3.5.0
  - @contractspec/module.examples@3.5.0
  - @contractspec/lib.ui-kit-web@3.5.0
  - @contractspec/lib.knowledge@3.5.0
  - @contractspec/lib.ui-link@3.5.0
  - @contractspec/lib.logger@3.5.0
  - @contractspec/lib.schema@3.5.0

## 3.4.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-runtime-server-graphql@3.4.3
  - @contractspec/lib.contracts-runtime-server-rest@3.4.3
  - @contractspec/lib.contracts-runtime-server-mcp@3.4.3
  - @contractspec/lib.contracts-integrations@3.4.3
  - @contractspec/module.context-storage@0.4.3
  - @contractspec/lib.contracts-library@3.4.3
  - @contractspec/lib.example-shared-ui@3.4.3
  - @contractspec/lib.provider-ranking@0.4.3
  - @contractspec/lib.runtime-sandbox@2.4.3
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.design-system@3.4.3
  - @contractspec/lib.content-gen@3.4.3
  - @contractspec/module.examples@3.4.3
  - @contractspec/lib.ui-kit-web@3.4.3
  - @contractspec/lib.knowledge@3.4.3
  - @contractspec/lib.ui-link@3.4.3
  - @contractspec/lib.logger@3.4.3
  - @contractspec/lib.schema@3.4.3

## 3.4.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-runtime-server-graphql@3.4.2
  - @contractspec/lib.contracts-runtime-server-rest@3.4.2
  - @contractspec/lib.contracts-runtime-server-mcp@3.4.2
  - @contractspec/lib.contracts-integrations@3.4.2
  - @contractspec/module.context-storage@0.4.2
  - @contractspec/lib.contracts-library@3.4.2
  - @contractspec/lib.example-shared-ui@3.4.2
  - @contractspec/lib.provider-ranking@0.4.2
  - @contractspec/lib.runtime-sandbox@2.4.2
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.design-system@3.4.2
  - @contractspec/lib.content-gen@3.4.2
  - @contractspec/module.examples@3.4.2
  - @contractspec/lib.ui-kit-web@3.4.2
  - @contractspec/lib.knowledge@3.4.2
  - @contractspec/lib.ui-link@3.4.2
  - @contractspec/lib.logger@3.4.2
  - @contractspec/lib.schema@3.4.2

## 3.4.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-runtime-server-graphql@3.4.1
  - @contractspec/lib.contracts-runtime-server-rest@3.4.1
  - @contractspec/lib.contracts-runtime-server-mcp@3.4.1
  - @contractspec/lib.contracts-integrations@3.4.1
  - @contractspec/module.context-storage@0.4.1
  - @contractspec/lib.contracts-library@3.4.1
  - @contractspec/lib.example-shared-ui@3.4.1
  - @contractspec/lib.provider-ranking@0.4.1
  - @contractspec/lib.runtime-sandbox@2.4.1
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.design-system@3.4.1
  - @contractspec/lib.content-gen@3.4.1
  - @contractspec/module.examples@3.4.1
  - @contractspec/lib.ui-kit-web@3.4.1
  - @contractspec/lib.knowledge@3.4.1
  - @contractspec/lib.ui-link@3.4.1
  - @contractspec/lib.logger@3.4.1
  - @contractspec/lib.schema@3.4.1

## 3.4.0

### Minor Changes

- 0ee467a: feat: improve ai and customization

### Patch Changes

- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-runtime-server-graphql@3.4.0
  - @contractspec/lib.contracts-runtime-server-rest@3.4.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.4.0
  - @contractspec/lib.contracts-integrations@3.4.0
  - @contractspec/module.context-storage@0.4.0
  - @contractspec/lib.contracts-library@3.4.0
  - @contractspec/lib.example-shared-ui@3.4.0
  - @contractspec/lib.provider-ranking@0.4.0
  - @contractspec/lib.runtime-sandbox@2.4.0
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.design-system@3.4.0
  - @contractspec/lib.content-gen@3.4.0
  - @contractspec/module.examples@3.4.0
  - @contractspec/lib.ui-kit-web@3.4.0
  - @contractspec/lib.knowledge@3.4.0
  - @contractspec/lib.ui-link@3.4.0
  - @contractspec/lib.logger@3.4.0
  - @contractspec/lib.schema@3.4.0

## 3.3.0

### Minor Changes

- 890a0da: fix: stability improvements

### Patch Changes

- Updated dependencies [890a0da]
- Updated dependencies [575b316]
  - @contractspec/lib.contracts-runtime-server-graphql@3.3.0
  - @contractspec/lib.contracts-runtime-server-rest@3.3.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.3.0
  - @contractspec/lib.contracts-integrations@3.3.0
  - @contractspec/module.context-storage@0.3.0
  - @contractspec/lib.contracts-library@3.3.0
  - @contractspec/lib.example-shared-ui@3.3.0
  - @contractspec/lib.provider-ranking@0.3.0
  - @contractspec/lib.runtime-sandbox@2.3.0
  - @contractspec/lib.contracts-spec@3.3.0
  - @contractspec/lib.design-system@3.3.0
  - @contractspec/lib.content-gen@3.3.0
  - @contractspec/module.examples@3.3.0
  - @contractspec/lib.ui-kit-web@3.3.0
  - @contractspec/lib.knowledge@3.3.0
  - @contractspec/lib.ui-link@3.3.0
  - @contractspec/lib.logger@3.3.0
  - @contractspec/lib.schema@3.3.0

## 3.2.1

### Patch Changes

- Updated dependencies [575b316]
  - @contractspec/lib.contracts-integrations@3.2.1
  - @contractspec/lib.content-gen@3.2.1
  - @contractspec/lib.knowledge@3.2.1
  - @contractspec/module.context-storage@0.2.1
  - @contractspec/module.examples@3.2.1
  - @contractspec/lib.design-system@3.2.1
  - @contractspec/lib.example-shared-ui@3.2.1

## 3.2.0

### Minor Changes

- a281fc5: fix: missing dependencies

### Patch Changes

- Updated dependencies [a281fc5]
  - @contractspec/lib.contracts-runtime-server-graphql@3.2.0
  - @contractspec/lib.contracts-runtime-server-rest@3.2.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.2.0
  - @contractspec/lib.contracts-integrations@3.2.0
  - @contractspec/module.context-storage@0.2.0
  - @contractspec/lib.contracts-library@3.2.0
  - @contractspec/lib.example-shared-ui@3.2.0
  - @contractspec/lib.provider-ranking@0.2.0
  - @contractspec/lib.runtime-sandbox@2.2.0
  - @contractspec/lib.contracts-spec@3.2.0
  - @contractspec/lib.design-system@3.2.0
  - @contractspec/lib.content-gen@3.2.0
  - @contractspec/module.examples@3.2.0
  - @contractspec/lib.ui-kit-web@3.2.0
  - @contractspec/lib.knowledge@3.2.0
  - @contractspec/lib.ui-link@3.2.0
  - @contractspec/lib.logger@3.2.0
  - @contractspec/lib.schema@3.2.0

## 3.1.1

### Patch Changes

- f1a249b: Regenerate docs-index JSON files to reflect new provider-ranking, ACP, agent, context, and database contract documentation entries produced by the build.
- Updated dependencies [02c0cc5]
  - @contractspec/lib.contracts-integrations@3.1.1
  - @contractspec/lib.contracts-spec@3.1.1
  - @contractspec/lib.design-system@3.1.1
  - @contractspec/lib.knowledge@3.1.1
  - @contractspec/module.context-storage@0.1.2
  - @contractspec/lib.contracts-library@3.1.1
  - @contractspec/lib.contracts-runtime-server-graphql@3.1.1
  - @contractspec/lib.contracts-runtime-server-mcp@3.1.1
  - @contractspec/lib.contracts-runtime-server-rest@3.1.1
  - @contractspec/lib.example-shared-ui@3.1.1
  - @contractspec/module.examples@3.1.1

## 3.1.0

### Minor Changes

- 28987eb: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [f2a4faf]
- Updated dependencies [28987eb]
- Updated dependencies [28987eb]
  - @contractspec/lib.contracts-spec@3.1.0
  - @contractspec/lib.contracts-runtime-server-graphql@3.1.0
  - @contractspec/lib.contracts-runtime-server-rest@3.1.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.1.0
  - @contractspec/lib.contracts-integrations@3.1.0
  - @contractspec/lib.contracts-library@3.1.0
  - @contractspec/lib.example-shared-ui@3.1.0
  - @contractspec/lib.runtime-sandbox@2.1.0
  - @contractspec/lib.design-system@3.1.0
  - @contractspec/module.examples@3.1.0
  - @contractspec/lib.ui-kit-web@3.1.0
  - @contractspec/lib.knowledge@3.1.0
  - @contractspec/lib.ui-link@3.1.0
  - @contractspec/lib.logger@3.1.0
  - @contractspec/lib.schema@3.1.0
  - @contractspec/module.context-storage@0.1.1

## 3.0.0

### Major Changes

- b781ce6: feat: improve ai readiness

### Patch Changes

- 0c438ac: Add architecture docs for the control-plane runtime and link the new page from the architecture overview and docs navigation.
- 95c27e4: Align ecosystem docs with the Cursor marketplace catalog model by documenting the root `.cursor-plugin/marketplace.json`, package-scoped plugin sources in `packages/apps-registry/cursor-marketplace`, and catalog-wide validation via `bun run plugin:contractspec:validate`.

  Rename ecosystem navigation and docblocks from generic Plugin API and Registry wording to Marketplace Plugins, Authoring Templates, and Marketplace Manifest for consistent docs discoverability.

- 3aa6269: Expand the integrations docs with Mistral, Slack, GitHub, WhatsApp Meta, WhatsApp Twilio, and health transport routing pages.

  Refresh the integrations overview/spec model and docs sidebar links so the new messaging and runtime guidance is discoverable from web-landing.

- Updated dependencies [7cbdb7f]
- Updated dependencies [c608804]
- Updated dependencies [e3bc858]
- Updated dependencies [b19ae0a]
- Updated dependencies [aa4a9c9]
- Updated dependencies [b781ce6]
  - @contractspec/lib.contracts-spec@3.0.0
  - @contractspec/lib.contracts-integrations@3.0.0
  - @contractspec/lib.contracts-runtime-server-graphql@3.0.0
  - @contractspec/lib.contracts-runtime-server-rest@3.0.0
  - @contractspec/lib.contracts-runtime-server-mcp@3.0.0
  - @contractspec/lib.contracts-library@3.0.0
  - @contractspec/lib.example-shared-ui@3.0.0
  - @contractspec/lib.runtime-sandbox@2.0.0
  - @contractspec/lib.design-system@3.0.0
  - @contractspec/module.examples@3.0.0
  - @contractspec/lib.ui-kit-web@3.0.0
  - @contractspec/lib.ui-link@3.0.0
  - @contractspec/lib.logger@3.0.0
  - @contractspec/lib.schema@3.0.0

## 2.9.1

### Patch Changes

- Updated dependencies [4556b80]
  - @contractspec/lib.contracts-integrations@2.10.0
  - @contractspec/lib.contracts-spec@2.10.0
  - @contractspec/lib.contracts-library@2.9.1
  - @contractspec/lib.contracts-runtime-server-graphql@2.9.1
  - @contractspec/lib.contracts-runtime-server-mcp@2.9.1
  - @contractspec/lib.contracts-runtime-server-rest@2.9.1
  - @contractspec/lib.design-system@2.9.1
  - @contractspec/lib.example-shared-ui@2.9.1
  - @contractspec/module.examples@2.9.1

## 2.9.0

### Minor Changes

- fix: minimatch version

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-runtime-server-graphql@2.9.0
  - @contractspec/lib.contracts-runtime-server-rest@2.9.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.9.0
  - @contractspec/lib.contracts-integrations@2.9.0
  - @contractspec/lib.contracts-library@2.9.0
  - @contractspec/lib.example-shared-ui@2.9.0
  - @contractspec/lib.runtime-sandbox@1.9.0
  - @contractspec/lib.contracts-spec@2.9.0
  - @contractspec/lib.design-system@2.9.0
  - @contractspec/module.examples@2.9.0
  - @contractspec/lib.ui-kit-web@2.9.0
  - @contractspec/lib.ui-link@2.9.0
  - @contractspec/lib.logger@2.9.0
  - @contractspec/lib.schema@2.9.0

## 2.8.0

### Minor Changes

- fix: tarball packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-integrations@2.8.0
  - @contractspec/lib.contracts-library@2.8.0
  - @contractspec/lib.contracts-runtime-server-graphql@2.8.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.8.0
  - @contractspec/lib.contracts-runtime-server-rest@2.8.0
  - @contractspec/lib.contracts-spec@2.8.0
  - @contractspec/lib.design-system@2.8.0
  - @contractspec/lib.example-shared-ui@2.8.0
  - @contractspec/lib.logger@2.8.0
  - @contractspec/lib.runtime-sandbox@1.8.0
  - @contractspec/lib.schema@2.8.0
  - @contractspec/lib.ui-kit-web@2.8.0
  - @contractspec/lib.ui-link@2.8.0
  - @contractspec/module.examples@2.8.0

## 2.7.0

### Minor Changes

- chore: release improvements

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-integrations@2.7.0
  - @contractspec/lib.contracts-library@2.7.0
  - @contractspec/lib.contracts-runtime-server-graphql@2.7.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.7.0
  - @contractspec/lib.contracts-runtime-server-rest@2.7.0
  - @contractspec/lib.contracts-spec@2.7.0
  - @contractspec/lib.design-system@2.7.0
  - @contractspec/lib.example-shared-ui@2.7.0
  - @contractspec/lib.logger@2.7.0
  - @contractspec/lib.runtime-sandbox@1.7.0
  - @contractspec/lib.schema@2.7.0
  - @contractspec/lib.ui-kit-web@2.7.0
  - @contractspec/lib.ui-link@2.7.0
  - @contractspec/module.examples@2.7.0

## 2.6.1

### Patch Changes

- Updated dependencies [f8dc3ad]
  - @contractspec/lib.design-system@2.6.1
  - @contractspec/lib.example-shared-ui@2.6.1
  - @contractspec/module.examples@2.6.1

## 2.6.0

### Minor Changes

- bae3db1: fix: build issues

### Patch Changes

- Updated dependencies [bae3db1]
  - @contractspec/lib.contracts-integrations@2.6.0
  - @contractspec/lib.contracts-library@2.6.0
  - @contractspec/lib.contracts-runtime-server-graphql@2.6.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.6.0
  - @contractspec/lib.contracts-runtime-server-rest@2.6.0
  - @contractspec/lib.contracts-spec@2.6.0
  - @contractspec/lib.design-system@2.6.0
  - @contractspec/lib.example-shared-ui@2.6.0
  - @contractspec/lib.logger@2.6.0
  - @contractspec/lib.runtime-sandbox@1.6.0
  - @contractspec/lib.schema@2.6.0
  - @contractspec/lib.ui-kit-web@2.6.0
  - @contractspec/lib.ui-link@2.6.0
  - @contractspec/module.examples@2.6.0

## 2.5.0

### Minor Changes

- c83c323: feat: major change to content generation

### Patch Changes

- Updated dependencies [4fa3bd4]
- Updated dependencies [63eee9b]
- Updated dependencies [284cbe2]
- Updated dependencies [c83c323]
  - @contractspec/lib.contracts-spec@2.5.0
  - @contractspec/lib.contracts-integrations@2.5.0
  - @contractspec/lib.contracts-runtime-server-graphql@2.5.0
  - @contractspec/lib.contracts-runtime-server-rest@2.5.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.5.0
  - @contractspec/lib.contracts-library@2.5.0
  - @contractspec/lib.example-shared-ui@2.5.0
  - @contractspec/lib.runtime-sandbox@1.5.0
  - @contractspec/lib.design-system@2.5.0
  - @contractspec/module.examples@2.5.0
  - @contractspec/lib.ui-kit-web@2.5.0
  - @contractspec/lib.ui-link@2.5.0
  - @contractspec/lib.logger@2.5.0
  - @contractspec/lib.schema@2.5.0

## 2.4.0

### Minor Changes

- chore: improve documentation

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-runtime-server-graphql@2.4.0
  - @contractspec/lib.contracts-runtime-server-rest@2.4.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.4.0
  - @contractspec/lib.contracts-integrations@2.4.0
  - @contractspec/lib.contracts-library@2.4.0
  - @contractspec/lib.example-shared-ui@2.4.0
  - @contractspec/lib.runtime-sandbox@1.4.0
  - @contractspec/lib.contracts-spec@2.4.0
  - @contractspec/lib.design-system@2.4.0
  - @contractspec/module.examples@2.4.0
  - @contractspec/lib.ui-kit-web@2.4.0
  - @contractspec/lib.ui-link@2.4.0
  - @contractspec/lib.logger@2.4.0
  - @contractspec/lib.schema@2.4.0

## 2.3.0

### Minor Changes

- 12c9556: feat: release agentpacks

### Patch Changes

- Updated dependencies [12c9556]
  - @contractspec/lib.contracts-runtime-server-graphql@2.3.0
  - @contractspec/lib.contracts-runtime-server-rest@2.3.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.3.0
  - @contractspec/lib.contracts-integrations@2.3.0
  - @contractspec/lib.contracts-library@2.3.0
  - @contractspec/lib.example-shared-ui@2.3.0
  - @contractspec/lib.runtime-sandbox@1.3.0
  - @contractspec/lib.contracts-spec@2.3.0
  - @contractspec/lib.design-system@2.3.0
  - @contractspec/module.examples@2.3.0
  - @contractspec/lib.ui-kit-web@2.3.0
  - @contractspec/lib.ui-link@2.3.0
  - @contractspec/lib.logger@2.3.0
  - @contractspec/lib.schema@2.3.0

## 2.2.0

### Minor Changes

- feat: release ContractSpec Studio

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-runtime-server-graphql@2.2.0
  - @contractspec/lib.contracts-runtime-server-rest@2.2.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.2.0
  - @contractspec/lib.contracts-integrations@2.2.0
  - @contractspec/lib.contracts-library@2.2.0
  - @contractspec/lib.example-shared-ui@2.2.0
  - @contractspec/lib.runtime-sandbox@1.2.0
  - @contractspec/lib.contracts-spec@2.2.0
  - @contractspec/lib.design-system@2.2.0
  - @contractspec/module.examples@2.2.0
  - @contractspec/lib.ui-kit-web@2.2.0
  - @contractspec/lib.ui-link@2.2.0
  - @contractspec/lib.logger@2.2.0
  - @contractspec/lib.schema@2.2.0

## 2.1.1

### Patch Changes

- 57e2819: chore: align Studio messaging with live product positioning
- Updated dependencies [57e2819]
  - @contractspec/lib.contracts-spec@2.1.1
  - @contractspec/lib.contracts-integrations@2.1.1
  - @contractspec/lib.contracts-library@2.1.1
  - @contractspec/lib.contracts-runtime-server-graphql@2.1.1
  - @contractspec/lib.contracts-runtime-server-mcp@2.1.1
  - @contractspec/lib.contracts-runtime-server-rest@2.1.1
  - @contractspec/lib.design-system@2.1.1
  - @contractspec/lib.example-shared-ui@2.1.1
  - @contractspec/module.examples@2.1.1

## 2.1.0

### Minor Changes

- 362fbac: feat: improve video
- 659d15f: feat: improve ai-agent analytics leveraging posthog

### Patch Changes

- Updated dependencies [b4bfbc5]
- Updated dependencies [362fbac]
- Updated dependencies [659d15f]
  - @contractspec/lib.contracts-spec@2.1.0
  - @contractspec/lib.contracts-runtime-server-graphql@2.1.0
  - @contractspec/lib.contracts-runtime-server-rest@2.1.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.1.0
  - @contractspec/lib.contracts-integrations@2.1.0
  - @contractspec/lib.contracts-library@2.1.0
  - @contractspec/lib.example-shared-ui@2.1.0
  - @contractspec/lib.runtime-sandbox@1.1.0
  - @contractspec/lib.design-system@2.1.0
  - @contractspec/module.examples@2.1.0
  - @contractspec/lib.ui-kit-web@2.1.0
  - @contractspec/lib.ui-link@2.1.0
  - @contractspec/lib.logger@2.1.0
  - @contractspec/lib.schema@2.1.0

## 2.0.0

### Major Changes

- a09bafc: feat: optimize performance

### Patch Changes

- f152678: Scaffolded split contracts packages for spec+registry, integrations definitions, and runtime adapters by surface (client-react, server-rest, server-graphql, server-mcp). Migrated first consumers and documentation examples to the new runtime package imports.
- Updated dependencies [a09bafc]
- Updated dependencies [94f3c24]
- Updated dependencies [f152678]
- Updated dependencies [7f3203a]
  - @contractspec/lib.contracts-runtime-server-graphql@2.0.0
  - @contractspec/lib.contracts-runtime-server-rest@2.0.0
  - @contractspec/lib.contracts-runtime-server-mcp@2.0.0
  - @contractspec/lib.contracts-integrations@2.0.0
  - @contractspec/lib.contracts-library@2.0.0
  - @contractspec/lib.example-shared-ui@2.0.0
  - @contractspec/lib.runtime-sandbox@1.0.0
  - @contractspec/lib.contracts-spec@2.0.0
  - @contractspec/lib.design-system@2.0.0
  - @contractspec/module.examples@2.0.0
  - @contractspec/lib.ui-kit-web@2.0.0
  - @contractspec/lib.ui-link@2.0.0
  - @contractspec/lib.logger@2.0.0
  - @contractspec/lib.schema@2.0.0

## 1.17.0

### Minor Changes

- 064258d: feat: upgrade all dependencies

### Patch Changes

- Updated dependencies [064258d]
- Updated dependencies [064258d]
  - @contractspec/lib.contracts-library@1.62.0
  - @contractspec/lib.example-shared-ui@1.16.0
  - @contractspec/lib.runtime-sandbox@0.17.0
  - @contractspec/lib.design-system@1.62.0
  - @contractspec/module.examples@1.62.0
  - @contractspec/lib.ui-kit-web@1.62.0
  - @contractspec/lib.contracts@1.62.0
  - @contractspec/lib.ui-link@1.62.0
  - @contractspec/lib.logger@1.62.0
  - @contractspec/lib.schema@1.62.0

## 1.16.0

### Minor Changes

- 374fd71: fix: publishing

### Patch Changes

- Updated dependencies [374fd71]
  - @contractspec/lib.contracts-library@1.61.0
  - @contractspec/lib.example-shared-ui@1.15.0
  - @contractspec/lib.runtime-sandbox@0.16.0
  - @contractspec/lib.design-system@1.61.0
  - @contractspec/module.examples@1.61.0
  - @contractspec/lib.ui-kit-web@1.61.0
  - @contractspec/lib.contracts-spec@1.61.0
  - @contractspec/lib.ui-link@1.61.0
  - @contractspec/lib.logger@1.61.0
  - @contractspec/lib.schema@1.61.0

## 1.15.0

### Minor Changes

- fix: publish with bun

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-library@1.60.0
  - @contractspec/lib.example-shared-ui@1.14.0
  - @contractspec/lib.runtime-sandbox@0.15.0
  - @contractspec/lib.design-system@1.60.0
  - @contractspec/module.examples@1.60.0
  - @contractspec/lib.ui-kit-web@1.60.0
  - @contractspec/lib.contracts-spec@1.60.0
  - @contractspec/lib.ui-link@1.60.0
  - @contractspec/lib.logger@1.60.0
  - @contractspec/lib.schema@1.60.0

## 1.14.0

### Minor Changes

- 1a0cf44: fix: publishConfig not supported by bun

### Patch Changes

- Updated dependencies [1a0cf44]
  - @contractspec/lib.contracts-library@1.59.0
  - @contractspec/lib.example-shared-ui@1.13.0
  - @contractspec/lib.runtime-sandbox@0.14.0
  - @contractspec/lib.design-system@1.59.0
  - @contractspec/module.examples@1.59.0
  - @contractspec/lib.ui-kit-web@1.59.0
  - @contractspec/lib.contracts-spec@1.59.0
  - @contractspec/lib.ui-link@1.59.0
  - @contractspec/lib.logger@1.59.0
  - @contractspec/lib.schema@1.59.0

## 1.13.0

### Minor Changes

- d1f0fd0: chore: Migrate non-app package builds from tsdown to shared Bun tooling, add `@contractspec/tool.bun`, and standardize `prebuild`/`build`/`typecheck` with platform-aware exports and `tsc` declaration emission into `dist`.

### Patch Changes

- Updated dependencies [d1f0fd0]
- Updated dependencies [4355a9e]
  - @contractspec/lib.contracts-library@1.58.0
  - @contractspec/lib.example-shared-ui@1.12.0
  - @contractspec/lib.runtime-sandbox@0.13.0
  - @contractspec/lib.design-system@1.58.0
  - @contractspec/module.examples@1.58.0
  - @contractspec/lib.ui-kit-web@1.58.0
  - @contractspec/lib.contracts-spec@1.58.0
  - @contractspec/lib.ui-link@1.58.0
  - @contractspec/lib.logger@1.58.0
  - @contractspec/lib.schema@1.58.0

## 1.12.0

### Minor Changes

- ad9d10a: feat: improve posthog integration
- 11a5a05: feat: improve product intent

### Patch Changes

- Updated dependencies [8ecf3c1]
- Updated dependencies [47c48c2]
- Updated dependencies [a119963]
- Updated dependencies [4651e06]
- Updated dependencies [ad9d10a]
- Updated dependencies [11a5a05]
  - @contractspec/lib.contracts-spec@1.57.0
  - @contractspec/module.examples@1.57.0
  - @contractspec/lib.contracts-library@1.57.0
  - @contractspec/lib.example-shared-ui@1.11.0
  - @contractspec/lib.runtime-sandbox@0.12.0
  - @contractspec/lib.design-system@1.57.0
  - @contractspec/lib.ui-kit-web@1.57.0
  - @contractspec/lib.ui-link@1.57.0
  - @contractspec/lib.logger@1.57.0
  - @contractspec/lib.schema@1.57.0

## 1.11.1

### Patch Changes

- fix: improve publish config
- Updated dependencies
  - @contractspec/lib.contracts-library@1.56.1
  - @contractspec/lib.example-shared-ui@1.10.1
  - @contractspec/lib.runtime-sandbox@0.11.1
  - @contractspec/lib.design-system@1.56.1
  - @contractspec/module.examples@1.56.1
  - @contractspec/lib.ui-kit-web@1.56.1
  - @contractspec/lib.contracts-spec@1.56.1
  - @contractspec/lib.ui-link@1.56.1
  - @contractspec/lib.logger@1.56.1
  - @contractspec/lib.schema@1.56.1

## 1.11.0

### Minor Changes

- fix: release

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-library@1.56.0
  - @contractspec/lib.example-shared-ui@1.10.0
  - @contractspec/lib.runtime-sandbox@0.11.0
  - @contractspec/lib.design-system@1.56.0
  - @contractspec/module.examples@1.56.0
  - @contractspec/lib.ui-kit-web@1.56.0
  - @contractspec/lib.contracts-spec@1.56.0
  - @contractspec/lib.ui-link@1.56.0
  - @contractspec/lib.logger@1.56.0
  - @contractspec/lib.schema@1.56.0

## 1.10.0

### Minor Changes

- fix: unpublished packages

### Patch Changes

- Updated dependencies
  - @contractspec/lib.contracts-library@1.55.0
  - @contractspec/lib.example-shared-ui@1.9.0
  - @contractspec/lib.runtime-sandbox@0.10.0
  - @contractspec/lib.design-system@1.55.0
  - @contractspec/module.examples@1.55.0
  - @contractspec/lib.ui-kit-web@1.55.0
  - @contractspec/lib.contracts-spec@1.55.0
  - @contractspec/lib.ui-link@1.55.0
  - @contractspec/lib.logger@1.55.0
  - @contractspec/lib.schema@1.55.0

## 1.9.0

### Minor Changes

- ec5e95c: chore: upgrade dependencies

### Patch Changes

- Updated dependencies [ec5e95c]
  - @contractspec/lib.example-shared-ui@1.8.0
  - @contractspec/lib.design-system@1.54.0
  - @contractspec/lib.ui-kit-web@1.54.0
  - @contractspec/lib.contracts-spec@1.54.0
  - @contractspec/lib.contracts-library@1.54.0
  - @contractspec/lib.logger@1.54.0
  - @contractspec/lib.runtime-sandbox@0.9.0
  - @contractspec/lib.schema@1.54.0
  - @contractspec/lib.ui-link@1.54.0
  - @contractspec/module.examples@1.54.0

## 1.8.0

### Minor Changes

- f4180d4: fix: performance improvement

### Patch Changes

- e9edc0d: Refine docs search contract description for workflow validation.
- eefeb1b: Split the generated docs index into a manifest and chunked JSON files to reduce bundle size and load reference data lazily, updating reference pages and generator outputs accordingly.
- fafe5e6: Add a docs pipeline guide and navigation entry for wiring generated reference docs into the web landing site.
- Updated dependencies [eefeb1b]
- Updated dependencies [5b371b1]
- Updated dependencies [f4180d4]
- Updated dependencies [64d84e1]
  - @contractspec/lib.design-system@1.53.0
  - @contractspec/lib.contracts-spec@1.53.0
  - @contractspec/module.examples@1.53.0
  - @contractspec/lib.schema@1.53.0
  - @contractspec/lib.contracts-library@1.53.0
  - @contractspec/lib.example-shared-ui@1.7.0
  - @contractspec/lib.logger@1.53.0
  - @contractspec/lib.runtime-sandbox@0.8.0
  - @contractspec/lib.ui-kit-web@1.53.0
  - @contractspec/lib.ui-link@1.53.0

## 1.7.0

### Minor Changes

- d93e6a9: fix: improve website

### Patch Changes

- Updated dependencies [d93e6a9]
  - @contractspec/lib.contracts-library@1.52.0
  - @contractspec/lib.example-shared-ui@1.6.0
  - @contractspec/lib.runtime-sandbox@0.7.0
  - @contractspec/lib.design-system@1.52.0
  - @contractspec/module.examples@1.52.0
  - @contractspec/lib.ui-kit-web@1.52.0
  - @contractspec/lib.contracts-spec@1.52.0
  - @contractspec/lib.ui-link@1.52.0
  - @contractspec/lib.logger@1.52.0
  - @contractspec/lib.schema@1.52.0

## 1.6.0

### Minor Changes

- e6faefb: feat: add guide to import existing codebase

### Patch Changes

- Updated dependencies [23e46e9]
- Updated dependencies [ad1f852]
- Updated dependencies [e6faefb]
  - @contractspec/lib.contracts-spec@1.51.0
  - @contractspec/lib.contracts-library@1.51.0
  - @contractspec/lib.example-shared-ui@1.5.0
  - @contractspec/lib.runtime-sandbox@0.6.0
  - @contractspec/lib.design-system@1.51.0
  - @contractspec/module.examples@1.51.0
  - @contractspec/lib.ui-kit-web@1.51.0
  - @contractspec/lib.ui-link@1.51.0
  - @contractspec/lib.logger@1.51.0
  - @contractspec/lib.schema@1.51.0

## 1.5.0

### Minor Changes

- 5325d6b: feat: improve seo

### Patch Changes

- Updated dependencies [5325d6b]
  - @contractspec/lib.contracts-spec@1.50.0
  - @contractspec/lib.contracts-library@1.50.0
  - @contractspec/lib.design-system@1.50.0
  - @contractspec/lib.example-shared-ui@1.4.0
  - @contractspec/lib.logger@1.50.0
  - @contractspec/lib.runtime-sandbox@0.5.0
  - @contractspec/lib.schema@1.50.0
  - @contractspec/lib.ui-kit-web@1.50.0
  - @contractspec/lib.ui-link@1.50.0
  - @contractspec/module.examples@1.50.0

## 1.4.0

### Minor Changes

- cafd041: fix: impact report comments within github action

### Patch Changes

- Updated dependencies [cafd041]
  - @contractspec/lib.contracts-library@1.49.0
  - @contractspec/lib.example-shared-ui@1.3.0
  - @contractspec/lib.runtime-sandbox@0.4.0
  - @contractspec/lib.design-system@1.49.0
  - @contractspec/module.examples@1.49.0
  - @contractspec/lib.ui-kit-web@1.49.0
  - @contractspec/lib.contracts-spec@1.49.0
  - @contractspec/lib.ui-link@1.49.0
  - @contractspec/lib.logger@1.49.0
  - @contractspec/lib.schema@1.49.0

## 1.3.1

### Patch Changes

- 918deb7: Add security policy, roadmap, RFC template, and Security & Trust docs page.
- ea245ef: Add ecosystem documentation pages for plugins, integrations, templates, and registry resolution.
- 2016af0: Add runnable docs guides, wire new docs routes, and validate the integration-hub example in CI.
- 54b778e: Add SEO-optimized intent pages for developer search queries.
- 86423e8: Add contextual Studio prompts and extend waitlist application details.
  - @contractspec/module.examples@1.48.2

## 1.3.0

### Minor Changes

- c560ee7: Add onboarding and documentation surfaces across the library and marketing bundles, plus small tracking, telemetry, and UI copy refinements to support adoption workflows.

### Patch Changes

- c560ee7: Document the CRM pipeline adoption narrative and keep the docs registry aligned with the new onboarding pages.
- 1536bf3: Improve static rendering for marketing/docs pages, streamline changelog aggregation, and keep the header interactions compatible with static builds.
- Updated dependencies [c560ee7]
- Updated dependencies [1536bf3]
  - @contractspec/lib.design-system@1.48.1
  - @contractspec/lib.contracts-spec@1.48.1
  - @contractspec/lib.example-shared-ui@1.2.1
  - @contractspec/lib.contracts-library@1.48.1
  - @contractspec/module.examples@1.48.1

## 1.2.0

### Minor Changes

- b0444a4: feat: reduce adoption's friction by allowing generation of contracts from an analyse of the codebase

### Patch Changes

- Updated dependencies [b0444a4]
  - @contractspec/lib.contracts-library@1.48.0
  - @contractspec/lib.example-shared-ui@1.2.0
  - @contractspec/lib.runtime-sandbox@0.3.0
  - @contractspec/lib.design-system@1.48.0
  - @contractspec/module.examples@1.48.0
  - @contractspec/lib.ui-kit-web@1.48.0
  - @contractspec/lib.contracts-spec@1.48.0
  - @contractspec/lib.ui-link@1.48.0
  - @contractspec/lib.logger@1.48.0
  - @contractspec/lib.schema@1.48.0

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
  - @contractspec/lib.contracts-library@1.47.0
  - @contractspec/lib.example-shared-ui@1.1.0
  - @contractspec/lib.runtime-sandbox@0.2.0
  - @contractspec/lib.design-system@1.47.0
  - @contractspec/module.examples@1.47.0
  - @contractspec/lib.ui-kit-web@1.47.0
  - @contractspec/lib.contracts-spec@1.47.0
  - @contractspec/lib.ui-link@1.47.0
  - @contractspec/lib.logger@1.47.0
  - @contractspec/lib.schema@1.47.0

## 1.0.1

### Patch Changes

- 7e21625: feat: library services (landing page & api)
- Updated dependencies [7e21625]
  - @contractspec/lib.contracts-library@1.46.2
  - @contractspec/lib.runtime-sandbox@0.1.1
  - @contractspec/lib.design-system@1.46.2
  - @contractspec/module.examples@1.46.2
  - @contractspec/lib.ui-kit-web@1.46.2
  - @contractspec/lib.contracts-spec@1.46.2
