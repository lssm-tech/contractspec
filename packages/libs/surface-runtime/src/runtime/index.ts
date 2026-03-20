export {
	type ApplySurfacePatchResult,
	applySurfacePatch,
} from './apply-surface-patch';
export {
	emitOverlayApplied,
	emitOverlayFailed,
	emitOverlaySaved,
	emitPatchApproved,
	emitPatchProposed,
	emitPatchRejected,
	emitPolicyDenied,
	emitPolicyRedacted,
} from './audit-events';
export { buildContext } from './build-context';
export {
	type ActionRegistry,
	type BundleExtensionRegistry,
	type CommandRegistry,
	createActionRegistry,
	createBundleExtensionRegistry,
	createCommandRegistry,
} from './extension-registry';
export {
	createFieldRendererRegistry,
	createMutableFieldRendererRegistry,
	FALLBACK_FIELD_KIND,
	type FieldRendererRegistry,
	type MutableFieldRendererRegistry,
} from './field-renderer-registry';
export {
	applyEntityFieldOverlays,
	fromOverlayRenderableField,
	mergeOverlayResultIntoFields,
	type SurfaceOverlayTargetRef,
	toOverlayRenderable,
	toOverlayRenderableField,
	toOverlayScopeContext,
	toOverlayTargetRef,
} from './overlay-alignment';
export {
	type OverlaySigningKey,
	signWorkspaceOverlay,
	verifyWorkspaceOverlay,
} from './overlay-signer';
export {
	type ApprovalGateOptions,
	type BundleOverrideStore,
	buildOverrideTargetKey,
	createInMemoryOverrideStore,
	createOverrideStoreWithApprovalGate,
	type StoredOverride,
} from './override-store';
export {
	compilePlannerPrompt,
	type PlannerPromptInput,
} from './planner-prompt';
export {
	buildSurfacePatchProposal,
	type PlannerToolConfig,
	PROPOSE_PATCH_TOOL_SCHEMA,
	proposePatchToolConfig,
} from './planner-tools';
export {
	evaluateAndEmitPatchPolicy,
	evaluatePatchProposalPolicy,
} from './policy-eval';
export { defaultPreferenceAdapter } from './preference-adapter';
export {
	type OverlayConflict,
	type OverlayMergeOptions,
	type PolicyHooks,
	type ResolveBundleOptions,
	type ResolvedSurfacePlan,
	resolveBundle,
} from './resolve-bundle';
export { resolvePreferenceProfile } from './resolve-preferences';
export { type RollbackResult, rollbackSurfacePatches } from './rollback';
export {
	createWidgetRegistry,
	type WidgetRegistry,
	type WidgetRegistryEntry,
	type WidgetTrust,
} from './widget-registry';
