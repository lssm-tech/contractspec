# @contractspec/lib.surface-runtime

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
