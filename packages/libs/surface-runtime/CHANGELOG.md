# @contractspec/lib.surface-runtime

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
