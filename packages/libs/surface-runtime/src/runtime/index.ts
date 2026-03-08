export { buildContext } from './build-context';
export { resolvePreferenceProfile } from './resolve-preferences';
export { defaultPreferenceAdapter } from './preference-adapter';
export {
  resolveBundle,
  type PolicyHooks,
  type ResolveBundleOptions,
  type OverlayMergeOptions,
  type OverlayConflict,
  type ResolvedSurfacePlan,
} from './resolve-bundle';
export {
  applySurfacePatch,
  type ApplySurfacePatchResult,
} from './apply-surface-patch';
export {
  compilePlannerPrompt,
  type PlannerPromptInput,
} from './planner-prompt';
export {
  proposePatchToolConfig,
  PROPOSE_PATCH_TOOL_SCHEMA,
  buildSurfacePatchProposal,
  type PlannerToolConfig,
} from './planner-tools';
export {
  createFieldRendererRegistry,
  createMutableFieldRendererRegistry,
  FALLBACK_FIELD_KIND,
  type FieldRendererRegistry,
  type MutableFieldRendererRegistry,
} from './field-renderer-registry';
export {
  createWidgetRegistry,
  type WidgetRegistry,
  type WidgetRegistryEntry,
  type WidgetTrust,
} from './widget-registry';
export {
  createActionRegistry,
  createCommandRegistry,
  createBundleExtensionRegistry,
  type ActionRegistry,
  type CommandRegistry,
  type BundleExtensionRegistry,
} from './extension-registry';
export {
  createInMemoryOverrideStore,
  createOverrideStoreWithApprovalGate,
  buildOverrideTargetKey,
  type BundleOverrideStore,
  type StoredOverride,
  type ApprovalGateOptions,
} from './override-store';
export {
  toOverlayScopeContext,
  toOverlayTargetRef,
  toOverlayRenderableField,
  fromOverlayRenderableField,
  toOverlayRenderable,
  mergeOverlayResultIntoFields,
  applyEntityFieldOverlays,
  type SurfaceOverlayTargetRef,
} from './overlay-alignment';
export {
  signWorkspaceOverlay,
  verifyWorkspaceOverlay,
  type OverlaySigningKey,
} from './overlay-signer';
export {
  emitPatchProposed,
  emitPatchApproved,
  emitPatchRejected,
  emitOverlaySaved,
  emitOverlayApplied,
  emitOverlayFailed,
  emitPolicyDenied,
  emitPolicyRedacted,
} from './audit-events';
export { rollbackSurfacePatches, type RollbackResult } from './rollback';
export {
  evaluatePatchProposalPolicy,
  evaluateAndEmitPatchPolicy,
} from './policy-eval';
