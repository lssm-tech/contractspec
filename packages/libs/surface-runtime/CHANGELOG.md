# @contractspec/lib.surface-runtime

## 0.5.27

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add a ContractSpec-native production-grade translation runtime and optional i18next adapter.
- Updated dependencies because of Add preference-aware DataView collection defaults and personalization adapters.
- Updated dependencies because of Move notifications to library-first contracts/runtime surfaces and add AppShell in-app notification affordances.
- Updated dependencies because of Add first-class FormSpec phone input support with country detection, split outputs, and flag rendering.
- Updated dependencies because of Add PWA update management contracts and runtime helpers.
- Updated dependencies because of Add a shared roles and permissions policy system across contracts, RBAC evaluation, AppShell adaptation, and personalization suppression.
  - @contractspec/lib.observability@3.7.27
  - @contractspec/lib.overlay-engine@3.7.27
  - @contractspec/lib.contracts-spec@6.2.0

## 0.5.26

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add contract-driven overflow behavior and typed DataView hints for shared DataView and DataTable surfaces.
- Updated dependencies because of Add production-ready collection defaults and renderer mode switching for DataView list, grid, and table specs.
- Updated dependencies because of Add numeric and temporal FormSpec field kinds with shared renderer support for number, percent, currency, and duration inputs.
  - @contractspec/lib.observability@3.7.26
  - @contractspec/lib.overlay-engine@3.7.26
  - @contractspec/lib.contracts-spec@6.1.0

## 0.5.25

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Remove avoidable Node crypto imports from ContractSpec runtime surfaces and keep signing helpers isolated.
- Updated dependencies because of Improve FormSpec autocomplete rendering and resolver-backed search.
- Updated dependencies because of Add first-class FormSpec email fields with native renderer affordances.
- Updated dependencies because of Add progressive FormSpec section and step layout metadata with shared React and design-system rendering support.
  - @contractspec/lib.observability@3.7.25
  - @contractspec/lib.overlay-engine@3.7.25
  - @contractspec/lib.contracts-spec@6.0.0

## 0.5.24

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add mobile-safe FormSpec layout helpers and scoped DataView filters.

FormSpec authors can now use `responsiveFormColumns(...)` for explicit mobile-first column metadata without changing legacy numeric `layout.columns` behavior. DataView contracts can declare `filterScope.initial` and `filterScope.locked` filters so generic list/search contracts can be reused in context-restricted screens while keeping locked constraints out of user-editable URL state.

- Updated dependencies because of Add OSS harness CLI verification with deterministic Playwright, optional agent-browser visual runs, auth profile refs, visual diff evidence, replay bundles, and core scenario success semantics.
  - @contractspec/lib.observability@3.7.24
  - @contractspec/lib.overlay-engine@3.7.24
  - @contractspec/lib.contracts-spec@5.7.0

## 0.5.23

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add password-aware FormSpec rendering with current/new password manager hints and visibility toggles.
  - @contractspec/lib.observability@3.7.23
  - @contractspec/lib.overlay-engine@3.7.23
  - @contractspec/lib.contracts-spec@5.6.0

## 0.5.22

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Stabilize Turborepo build caching by making generated artifacts deterministic, modeling web LLM generation explicitly, and avoiding no-op build-tool rewrites.
  - @contractspec/lib.observability@3.7.22
  - @contractspec/lib.overlay-engine@3.7.22
  - @contractspec/lib.contracts-spec@5.5.1

## 0.5.21

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Add FormSpec layout hints, semantic field rendering, and portable text/textarea input-group addons.
- Updated dependencies because of Add ThemeSpec light/dark modes and a design-system Tailwind bridge for CSS variables, presets, CSS text, and OKLCH color pass-through.
- Updated dependencies because of Add a canonical typed result system for ContractSpec success and failure propagation across operations, workflows, jobs, server adapters, MCP, GraphQL, and React clients.
  - @contractspec/lib.observability@3.7.21
  - @contractspec/lib.overlay-engine@3.7.21
  - @contractspec/lib.contracts-spec@5.5.0

## 0.5.20

### Patch Changes

- chore: auto-bump internal dependents
- Updated dependencies because of Add a family-aware ContractSpec Adoption Engine, expand contract authoring targets across CLI and VS Code tooling, and refresh release-facing schema and policy artifacts for downstream workspaces.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Improve app-config, theme, and feature authoring with explicit validation APIs, first-class theme discovery and scaffolding, and key-based app-config generation across contracts, workspace tooling, and the CLI.
- Updated dependencies because of Refresh root, package, website, and LLM-facing docs so Connect, Builder, release capsules, and the current contracts-spec export surface stay aligned.
- Updated dependencies because of Persist canonical knowledge payload text during indexing and align the retrieval/query docs with the corrected behavior.
  - @contractspec/lib.contracts-spec@5.4.0
  - @contractspec/lib.observability@3.7.20
  - @contractspec/lib.overlay-engine@3.7.20

## 0.5.19

### Patch Changes

- Updated dependencies because of Expand ContractSpec authoring with preset-driven workspace setup, shell completion, packaged workspace schema artifacts, and richer form and UI surfaces across the CLI, editors, and shared runtimes.
  - @contractspec/lib.contracts-spec@5.3.0
  - @contractspec/lib.observability@3.7.19
  - @contractspec/lib.overlay-engine@3.7.19

## 0.5.18

### Patch Changes

- Pass Bun transpile paths through production JSX mode so published browser bundles stop emitting the dev runtime.
  - Packages: @contractspec/tool.bun (patch), @contractspec/bundle.marketing (patch), @contractspec/lib.accessibility (patch), @contractspec/lib.contracts-runtime-client-react (patch), @contractspec/lib.design-system (patch), @contractspec/lib.example-shared-ui (patch), @contractspec/lib.presentation-runtime-react (patch), @contractspec/lib.surface-runtime (patch), @contractspec/lib.ui-kit (patch), @contractspec/lib.ui-kit-web (patch), @contractspec/lib.ui-link (patch), @contractspec/lib.video-gen (patch), @contractspec/module.builder-workbench (patch), @contractspec/module.examples (patch), @contractspec/module.execution-console (patch), @contractspec/module.mobile-review (patch)
  - Migration: Pull the patch releases for the affected Contractspec React/browser packages.
- Updated dependencies because of chore: auto-bump internal dependents
- Updated dependencies because of Introduce the Builder v3 control plane as a governed authoring layer over external execution providers.
- Updated dependencies because of Implement ContractSpec Connect as a first-class spec, runtime, and CLI workflow.
  - @contractspec/lib.observability@3.7.18
  - @contractspec/lib.overlay-engine@3.7.18
  - @contractspec/lib.contracts-spec@5.2.0

## 0.5.17

### Patch Changes

- Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
  - Migration: Keep Node-only workflow runner code out of "use workflow" entrypoints.
  - Deprecations: Importing the broad `@contractspec/lib.contracts-spec/workflow` barrel from sandboxed workflow entrypoints is discouraged.
- Updated dependencies because of Fix workflow runtime imports for sandboxed workflow execution and keep workflow authoring on safe subpaths.
- Updated dependencies because of Add versioning-backed release capsules, generated patch notes, and guided upgrade flows.
  - @contractspec/lib.contracts-spec@5.1.0
  - @contractspec/lib.overlay-engine@3.7.17
  - @contractspec/lib.observability@3.7.17

## 0.5.16

### Patch Changes

- 2b59171: fix: crypto package issue due to nodejs only runtime
- Updated dependencies [2b59171]
  - @contractspec/lib.contracts-spec@5.0.4
  - @contractspec/lib.overlay-engine@3.7.16
  - @contractspec/lib.observability@3.7.16

## 0.5.15

### Patch Changes

- cce2b13: Add first-class Workflow DevKit support for `WorkflowSpec`, including new runtime metadata, stricter validation for Workflow-backed workflows, a dedicated Workflow DevKit integration package, CLI artifact generation, and Workflow-aware chat route helpers exposed from `@contractspec/module.ai-chat/core/workflow` so standard chat imports do not pull Workflow-only runtime assets into non-Workflow builds.

  Also harden supporting runtime surfaces by reusing Playwright browser instances in the harness runtime, mapping design-system button `onPress` handlers correctly to DOM clicks, and switching the workspace git adapter to argument-safe subprocess calls while tightening slow test coverage around those flows.

- Updated dependencies [cce2b13]
  - @contractspec/lib.contracts-spec@5.0.3
  - @contractspec/lib.overlay-engine@3.7.15
  - @contractspec/lib.observability@3.7.15

## 0.5.14

### Patch Changes

- chore: stability & release
- Updated dependencies
- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.2
  - @contractspec/lib.overlay-engine@3.7.14
  - @contractspec/lib.observability@3.7.14

## 0.5.13

### Patch Changes

- Updated dependencies [dd6e074]
  - @contractspec/lib.contracts-spec@5.0.1
  - @contractspec/lib.observability@3.7.13
  - @contractspec/lib.overlay-engine@3.7.13

## 0.5.12

### Patch Changes

- Updated dependencies [81256ea]
- Updated dependencies [2619dd8]
- Updated dependencies [81256ea]
- Updated dependencies [a4489bb]
- Updated dependencies [9cb304e]
  - @contractspec/lib.contracts-spec@5.0.0
  - @contractspec/lib.observability@3.7.12
  - @contractspec/lib.overlay-engine@3.7.12

## 0.5.11

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.3
  - @contractspec/lib.overlay-engine@3.7.11
  - @contractspec/lib.observability@3.7.11

## 0.5.10

### Patch Changes

- 1a44cb6: feat: improve examples to increase coverage of Contracts type
- Updated dependencies [1a44cb6]
  - @contractspec/lib.contracts-spec@4.1.2
  - @contractspec/lib.overlay-engine@3.7.10
  - @contractspec/lib.observability@3.7.10

## 0.5.9

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@4.1.1
  - @contractspec/lib.overlay-engine@3.7.9
  - @contractspec/lib.observability@3.7.9

## 0.5.6

### Patch Changes

- fix: release manifest
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.6
  - @contractspec/lib.overlay-engine@3.7.6
  - @contractspec/lib.observability@3.7.6

## 0.5.5

### Patch Changes

- ecf195a: fix: release security
- Updated dependencies [ecf195a]
  - @contractspec/lib.contracts-spec@3.7.5
  - @contractspec/lib.overlay-engine@3.7.5
  - @contractspec/lib.observability@3.7.5

## 0.5.4

### Patch Changes

- fix: release security
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.4
  - @contractspec/lib.overlay-engine@3.7.4
  - @contractspec/lib.observability@3.7.4

## 0.5.3

### Patch Changes

- fix: release
- Updated dependencies
  - @contractspec/lib.contracts-spec@3.7.3
  - @contractspec/lib.overlay-engine@3.7.3
  - @contractspec/lib.observability@3.7.3

## 0.5.2

### Patch Changes

- 8cd229b: fix: release
- Updated dependencies [8cd229b]
- Updated dependencies [04bc555]
  - @contractspec/lib.contracts-spec@3.7.2
  - @contractspec/lib.overlay-engine@3.7.2
  - @contractspec/lib.observability@3.7.2

## 0.5.1

### Patch Changes

- 5eb8626: fix: package exports
- Updated dependencies [5eb8626]
  - @contractspec/lib.contracts-spec@3.7.1
  - @contractspec/lib.overlay-engine@3.7.1
  - @contractspec/lib.observability@3.7.1

## 0.5.0

### Minor Changes

- f88df2d: feat: add expo mobile app example

### Patch Changes

- Updated dependencies [f88df2d]
  - @contractspec/lib.contracts-spec@3.7.0
  - @contractspec/lib.overlay-engine@3.7.0
  - @contractspec/lib.observability@3.7.0

## 0.4.0

### Minor Changes

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/lib.overlay-engine@3.6.0
  - @contractspec/lib.observability@3.6.0

## 0.3.5

### Patch Changes

- 693eedd: chore: improve ai models
- Updated dependencies [27b77db]
- Updated dependencies [693eedd]
  - @contractspec/lib.contracts-spec@3.5.5
  - @contractspec/lib.overlay-engine@3.5.5
  - @contractspec/lib.observability@3.5.5

## 0.3.4

### Patch Changes

- c585fb1: fix: mcp tooling naming
- Updated dependencies [c585fb1]
- Updated dependencies [f5d4816]
  - @contractspec/lib.contracts-spec@3.5.4
  - @contractspec/lib.overlay-engine@3.5.4
  - @contractspec/lib.observability@3.5.4

## 0.3.3

### Patch Changes

- b0b4da6: fix: release
- Updated dependencies [b0b4da6]
  - @contractspec/lib.contracts-spec@3.5.3
  - @contractspec/lib.overlay-engine@3.5.3
  - @contractspec/lib.observability@3.5.3

## 0.3.2

### Patch Changes

- 18df977: fix: release workflow
- Updated dependencies [18df977]
  - @contractspec/lib.contracts-spec@3.5.2
  - @contractspec/lib.overlay-engine@3.5.2
  - @contractspec/lib.observability@3.5.2

## 0.3.1

### Patch Changes

- dfff0d4: fix: use client within lib surface-runtime
- Updated dependencies [dfff0d4]
  - @contractspec/lib.contracts-spec@3.5.1
  - @contractspec/lib.overlay-engine@3.5.1
  - @contractspec/lib.observability@3.5.1

## 0.3.0

### Minor Changes

- 230bdf6: feat: ai-chat wireing

### Patch Changes

- 1fa29a0: feat(surface-runtime): add slotContent prop to BundleRenderer

  - Allow override content for any slot via slotContent partial record
  - Render slotContent[slotId] when provided instead of SlotRenderer

- Updated dependencies [230bdf6]
  - @contractspec/lib.contracts-spec@3.5.0
  - @contractspec/lib.overlay-engine@3.5.0
  - @contractspec/lib.observability@3.5.0

## 0.2.3

### Patch Changes

- 5f7c617: feat: improve ai docs
- Updated dependencies [5f7c617]
  - @contractspec/lib.contracts-spec@3.4.3
  - @contractspec/lib.overlay-engine@3.4.3
  - @contractspec/lib.observability@3.4.3

## 0.2.2

### Patch Changes

- 78d56a4: fix: release workflow
- Updated dependencies [78d56a4]
  - @contractspec/lib.contracts-spec@3.4.2
  - @contractspec/lib.overlay-engine@3.4.2
  - @contractspec/lib.observability@3.4.2

## 0.2.1

### Patch Changes

- 8f47829: fix: circular import issue
- Updated dependencies [8f47829]
  - @contractspec/lib.contracts-spec@3.4.1
  - @contractspec/lib.overlay-engine@3.4.1
  - @contractspec/lib.observability@3.4.1

## 0.2.0

### Minor Changes

- 0ee467a: feat: improve ai and customization
- 56ee8e6: feat(surface-runtime): AI-native chat and generative UI integration (07_ai_native_chat_and_generative_ui)

  - Add PlannerResponse, BlockDraft, PatchAuditEvent, PatchAuditPayload, PatchApprovalHandler types
  - Add compilePlannerPrompt for planner system prompt compilation
  - Add proposePatchToolConfig and buildSurfacePatchProposal for ContractSpecAgent integration
  - Add validatePatchProposal for allowed ops, slots, and node kinds
  - Add BundleRenderer assistantSlotId/assistantSlotContent props for ChatContainer wiring
  - Document AI chat integration in README

- 56ee8e6: Implement core bundle spec types per 03_core_bundle_spec: ModuleBundleSpec with requires, ActionSpec, CommandSpec, BundlePresetSpec, BundleExtensionPointSpec, BundleTelemetrySpec, BundleGovernanceSpec, TabsRegion, FloatingRegion, SurfacePatchOp (reveal-field, hide-field, promote-action), validateSurfacePatch, and extended BundleContext (locale, timezone, entity, conversation).
- 56ee8e6: feat(surface-runtime): entity surface registry and field renderer registry

  Implements 06_entity_surfaces plan:

  - EntitySurfaceRegistrySpec with entityTypes, fieldKinds, sectionKinds, viewKinds
  - FieldRendererRegistry with core kinds (text, number, date, select, checkbox) and stubs (relation, rollup, formula, people)
  - New BundleNodeKind values: entity-header, entity-summary, entity-activity, entity-relations, etc.
  - Section and entity-field rendering in SlotRenderer
  - PM workbench example with entities registry
  - ResolvedEntitySchema, ResolvedField, ResolvedSection, ResolvedViewPreset types

- 56ee8e6: Extension and override model (07_extensions): overlay alignment, widget/field/action/command registries, override store, overlay merge in resolution.
- 56ee8e6: Policy, audit, and rollback (spec 10). Policy hooks (evaluateNode, evaluatePatchProposal), audit event schema and emitters, inverse ops for set-layout/reveal-field/hide-field, rollbackSurfacePatches API, validateSurfacePatch enforcement in applySurfacePatch.
- 56ee8e6: Introduce lib.surface-runtime: AI-native surface specs and web runtime for adaptive ContractSpec surfaces. Phase 1: buildContext, resolveBundle (fallbacks, data recipes, policy hooks), applySurfacePatch (validation, inverse ops), resolvePreferenceProfile, ResolvedPreferenceProfile, BundlePreferenceAdapter.
- 56ee8e6: feat(surface-runtime): UI adapters and React renderer (Phase 2)
  - Add adapter interfaces for BlockNote, dnd-kit, Floating UI, Motion, resizable-panels, AI SDK
  - Implement adapter stubs (no direct third-party imports)
  - Add layoutRoot to ResolvedSurfacePlan for renderer
  - Implement BundleProvider with plan and preferences context
  - Implement BundleRenderer with RegionRenderer, SlotRenderer, panel groups
  - Map pace preference to motion tokens (deliberate/balanced/rapid)
  - Panel layout persistence via localStorage (restoreLayout/saveLayout)

### Patch Changes

- 56ee8e6: feat(surface-runtime): API skeleton Phase 0 — validators, example bundle, adapter lint

  - Add validateLayoutSlots: throws when layout references undeclared slot
  - Add validateBundleNodeKinds: returns warnings for node kinds without dedicated renderers
  - Integrate validateLayoutSlots into defineModuleBundle
  - Add example pm-workbench.bundle.ts in src/examples/
  - Add lint:adapters script to enforce no third-party UI imports outside src/adapters/
  - Document adapter rule in README

- 56ee8e6: Bundle spec alignment and i18n support

  **surface-runtime**

  - Add i18n for OverlayConflictResolver and PatchProposalCard (en, fr, es)
  - Add locale to ResolvedSurfacePlan; pass through from BundleContext
  - Export ./i18n with createSurfaceI18n, SURFACE_KEYS

  **personalization**

  - Add PreferenceDimensions, BundlePreferenceAdapter, ResolvedPreferenceProfile
  - Align with specs/contractspec_modules_bundle_spec_2026-03-08 (05_personalization_model)
  - Export ./preference-dimensions

  **contracts-spec**

  - Add validateBundleRequires for ModuleBundleSpec.requires validation
  - Document bundle requires alignment in README and AGENTS.md

  **ai-agent**

  - Document surface-runtime planner tools integration in README
  - Add optional peer @contractspec/lib.surface-runtime

  **module.ai-chat**

  - Add UseChatToolDef and optional tools to UseChatOptions (reserved for planner)
  - Document bundle spec alignment; add optional peer @contractspec/lib.surface-runtime

- 56ee8e6: Add observability, evals, and metrics for surface runtime

  - Integrate with lib.observability: tracing (traceAsync), metrics (resolution_duration_ms, patch_acceptance_rate, policy_denial_count, surface_fallback, missing_renderer), structured logging
  - Add golden-context harness for resolver evals with snapshot tests
  - Add performance budget check (resolver p95 <100ms)
  - Add missing renderer counter when slot has no renderer for node kind
  - Document eval runbook in docs/evals-runbook.md

- 56ee8e6: Personalization model: ResolvedPreferenceProfile (canonical, sourceByDimension, constrained, notes), PreferenceScope, BundlePreferenceAdapter, defaultPreferenceAdapter, scope resolution order, constraint stub, savePreferencePatch stub. Docs: preference vs layout vs overlay, dimension mapping.
- 56ee8e6: Implement resolution runtime (02): ResolvedSurfacePlan with actions, commands, adaptation, overlays, ai; preference adaptation stub; policy allowNode/redactBinding; error surface fallback; ResolvedAdaptation, AppliedOverlayMeta, SurfacePatchProposal types.
- 56ee8e6: Add ROLLOUT.md with phased delivery plan, performance budgets, risks, and pilot route. Update README with rollout status and link. Consolidate telemetry imports in resolve-bundle.
- 56ee8e6: Verification matrix: require 10+ char descriptions per dimension, add snapshot coverage, and docs
- 56ee8e6: Foundation: add observability dep, document package strategy (hard deps, interoperability, peer deps), expand terminology glossary. Fix ResolvedPreferenceProfile type and lint issues.
- Updated dependencies [0ee467a]
- Updated dependencies [56ee8e6]
  - @contractspec/lib.contracts-spec@3.4.0
  - @contractspec/lib.overlay-engine@3.4.0
  - @contractspec/lib.observability@3.4.0
