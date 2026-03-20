/**
 * Core bundle spec types for @contractspec/lib.surface-runtime.
 * Aligns with 03_core_bundle_spec.md and 01_preference_dimensions.md.
 */

export type BundleScope = 'system' | 'workspace' | 'team' | 'user' | 'session';

export type SurfaceKind =
	| 'overview'
	| 'list'
	| 'detail'
	| 'editor'
	| 'workbench'
	| 'assistant'
	| 'board'
	| 'timeline'
	| 'canvas';

export interface PreferenceDimensions {
	guidance: 'none' | 'hints' | 'tooltips' | 'walkthrough' | 'wizard';
	density: 'minimal' | 'compact' | 'standard' | 'detailed' | 'dense';
	dataDepth: 'summary' | 'standard' | 'detailed' | 'exhaustive';
	control: 'restricted' | 'standard' | 'advanced' | 'full';
	media: 'text' | 'visual' | 'voice' | 'hybrid';
	pace: 'deliberate' | 'balanced' | 'rapid';
	narrative: 'top-down' | 'bottom-up' | 'adaptive';
}

/** Scope from which a preference value was resolved. Order: user → workspace-user → bundle → surface → entity → session. */
export type PreferenceScope =
	| 'user'
	| 'workspace-user'
	| 'bundle'
	| 'surface'
	| 'entity'
	| 'session';

/** Resolved preference profile with source attribution and constraint notes per dimension. */
export interface ResolvedPreferenceProfile {
	/** Canonical values after scope merge and constraint resolution. */
	canonical: PreferenceDimensions;
	/** Source scope per dimension (which layer provided the value). */
	sourceByDimension: Partial<
		Record<keyof PreferenceDimensions, PreferenceScope>
	>;
	/** Dimensions that were constrained (requested value not applied); value = reason. */
	constrained: Partial<Record<keyof PreferenceDimensions, string>>;
	/** Human-readable notes (e.g. constraint reasons, fallbacks). */
	notes: string[];
}

/** Adapter for resolving and persisting preferences in the bundle runtime. */
export interface BundlePreferenceAdapter {
	resolve(ctx: BundleContext): Promise<ResolvedPreferenceProfile>;
	savePreferencePatch(args: {
		actorId: string;
		workspaceId?: string;
		patch: Partial<PreferenceDimensions>;
		scope: 'user' | 'workspace-user' | 'surface';
	}): Promise<void>;
}

export interface BundleContext {
	tenantId: string;
	workspaceId?: string;
	actorId?: string;
	route: string;
	params: Record<string, string>;
	query: Record<string, string | string[]>;
	device: 'desktop' | 'tablet' | 'mobile';
	mode?: 'guided' | 'pro' | 'autopilot';
	locale?: string;
	timezone?: string;
	entity?: {
		type: string;
		id: string;
	};
	conversation?: {
		threadId?: string;
		assistantId?: string;
		activeIntent?: string;
	};
	/** Active saved view ID (viewKind key). When set, layout selection prefers view's defaultLayoutId. */
	activeViewId?: string;
	preferences: PreferenceDimensions;
	capabilities: string[];
	featureFlags?: string[];
}

/** Predicate for route/surface/layout selection. */
export type BundlePredicate<C extends BundleContext = BundleContext> = (
	ctx: C
) => boolean;

/** Minimal params to build a BundleContext. Missing fields use defaults. */
export interface BuildContextParams {
	route: string;
	params?: Record<string, string>;
	query?: Record<string, string | string[]>;
	tenantId?: string;
	workspaceId?: string;
	actorId?: string;
	device?: 'desktop' | 'tablet' | 'mobile';
	preferences?: Partial<PreferenceDimensions>;
	capabilities?: string[];
	featureFlags?: string[];
	mode?: 'guided' | 'pro' | 'autopilot';
	locale?: string;
	timezone?: string;
	entity?: { type: string; id: string };
	conversation?: {
		threadId?: string;
		assistantId?: string;
		activeIntent?: string;
	};
	/** Active saved view ID (viewKind key). When set, layout selection prefers view's defaultLayoutId. */
	activeViewId?: string;
}

export type BundleNodeKind =
	| 'metric-strip'
	| 'data-view'
	| 'entity-card'
	| 'entity-header'
	| 'entity-summary'
	| 'entity-section'
	| 'entity-field'
	| 'entity-activity'
	| 'entity-relations'
	| 'entity-timeline'
	| 'entity-comments'
	| 'entity-attachments'
	| 'entity-view-switcher'
	| 'entity-automation-panel'
	| 'rich-doc'
	| 'chat-thread'
	| 'assistant-panel'
	| 'action-bar'
	| 'timeline'
	| 'board'
	| 'table'
	| 'calendar'
	| 'form'
	| 'chart'
	| 'relation-graph'
	| 'custom-widget';

export interface BundleMeta {
	key: string;
	version: string;
	title: string;
	description?: string;
	owners?: string[];
	tags?: string[];
	stability?: 'experimental' | 'beta' | 'stable';
}

// ── Entity surface registry (08_entity_surface_and_custom_fields) ────────────

/** Supported field kinds for entity rendering. */
export type EntityFieldKind =
	| 'text'
	| 'number'
	| 'date'
	| 'checkbox'
	| 'select'
	| 'options'
	| 'instance'
	| 'url'
	| 'relation'
	| 'rollup'
	| 'formula'
	| 'people';

/** Spec for how a field kind is rendered (viewer, editor, table cell, etc.). */
export interface FieldRendererSpec {
	fieldKind: string;
	viewer: string;
	editor?: string;
	summaryViewer?: string;
	tableCell?: string;
	filters?: string[];
	validators?: string[];
}

/** Spec for how a section type is rendered. */
export interface SectionRendererSpec {
	sectionKind: string;
	renderer: string;
	defaultCollapsed?: boolean;
	densityBehavior?: 'minimal' | 'compact' | 'standard' | 'detailed';
}

/** Spec for how a saved view type is applied. */
export interface ViewRendererSpec {
	viewKind: string;
	renderer: string;
	defaultLayoutId?: string;
	promotedActions?: string[];
}

/** Per-entity-type surface configuration. */
export interface EntityTypeSurfaceSpec {
	entityType: string;
	defaultSurfaceId: string;
	detailBlueprints: string[];
	supportedViews: string[];
	sectionsFromSchema?: boolean;
	fieldsFromSchema?: boolean;
	relationPanels?: string[];
}

/** Registry of entity types, field kinds, sections, and views. */
export interface EntitySurfaceRegistrySpec {
	entityTypes: Record<string, EntityTypeSurfaceSpec>;
	fieldKinds: Record<string, FieldRendererSpec>;
	sectionKinds?: Record<string, SectionRendererSpec>;
	viewKinds?: Record<string, ViewRendererSpec>;
}

/** Resolved field for entity rendering. */
export interface ResolvedField {
	fieldId: string;
	fieldKind: string;
	title: string;
	visible: boolean;
	editable: boolean;
	required: boolean;
	sectionId?: string;
}

/** Resolved section for entity layout. */
export interface ResolvedSection {
	sectionId: string;
	sectionKind: string;
	title: string;
	collapsed?: boolean;
	fieldIds: string[];
}

/** Resolved saved view preset. */
export interface ResolvedViewPreset {
	viewId: string;
	viewKind: string;
	title: string;
	filter?: unknown;
	sort?: unknown;
	group?: unknown;
	displayType?: string;
	visibleFieldIds?: string[];
	layoutHints?: Record<string, unknown>;
}

/** Resolved entity schema for rendering. */
export interface ResolvedEntitySchema {
	entityType: string;
	sections: ResolvedSection[];
	fields: ResolvedField[];
	views: ResolvedViewPreset[];
}

/** Resolver for entity schemas. Stub in Phase 3; full impl deferred. */
export interface EntitySurfaceResolver {
	resolveEntitySchema(args: {
		entityType: string;
		entityId: string;
		workspaceId?: string;
	}): Promise<ResolvedEntitySchema>;
}

export interface BundlePresetSpec {
	presetId: string;
	title: string;
	description?: string;
	preferencePatch: Partial<PreferenceDimensions>;
	defaultLayoutIdBySurface?: Record<string, string>;
}

export interface BundleExtensionPointSpec {
	extensionPointId: string;
	title: string;
	accepts: 'widget' | 'field-renderer' | 'action' | 'command' | 'surface-patch';
	trust: 'core' | 'workspace' | 'signed-plugin' | 'ephemeral-ai';
}

export interface BundleTelemetrySpec {
	namespace: string;
	emitSurfaceResolved?: boolean;
	emitPatchApplied?: boolean;
	emitIntentMatched?: boolean;
	emitPreferenceAdaptation?: boolean;
}

export interface BundleGovernanceSpec {
	requireApprovalForWorkspacePatches?: boolean;
	requireApprovalForAiPatches?: boolean;
	retainAuditDays?: number;
}

export interface ModuleBundleSpec<C extends BundleContext = BundleContext> {
	meta: BundleMeta;
	/** Required features (e.g. ai-chat, metering) from contracts-spec defineFeature. */
	requires?: { key: string; version: string }[];
	routes: BundleRouteSpec<C>[];
	surfaces: Record<string, SurfaceSpec<C>>;
	entities?: EntitySurfaceRegistrySpec;
	presets?: BundlePresetSpec[];
	ai?: BundleAiSpec<C>;
	extensions?: BundleExtensionPointSpec[];
	telemetry?: BundleTelemetrySpec;
	governance?: BundleGovernanceSpec;
}

export interface BundleRouteSpec<C extends BundleContext = BundleContext> {
	routeId: string;
	path: string;
	defaultSurface: string;
	candidateSurfaces?: string[];
	when?: BundlePredicate<C>;
}

export interface ActionSpec {
	actionId: string;
	title: string;
	operationKey?: string;
	intent?: string;
	placement?: 'header' | 'inline' | 'context' | 'assistant';
	requiresCapabilities?: string[];
}

export interface CommandSpec {
	commandId: string;
	title: string;
	intent: string;
	shortcut?: string[];
}

export interface SurfaceSpec<C extends BundleContext = BundleContext> {
	surfaceId: string;
	kind: SurfaceKind;
	title: string;
	when?: BundlePredicate<C>;
	priority?: number;
	slots: SlotSpec[];
	layouts: LayoutBlueprintSpec<C>[];
	data: DataRecipeSpec<C>[];
	actions?: ActionSpec[];
	commands?: CommandSpec[];
	ai?: SurfaceAiSpec<C>;
	verification: SurfaceVerificationSpec;
}

export interface SlotSpec {
	slotId: string;
	role:
		| 'header'
		| 'primary'
		| 'secondary'
		| 'assistant'
		| 'inspector'
		| 'footer'
		| 'floating'
		| 'command';
	accepts: BundleNodeKind[];
	cardinality: 'one' | 'many';
	mutableByAi?: boolean;
	mutableByUser?: boolean;
}

export interface LayoutBlueprintSpec<C extends BundleContext = BundleContext> {
	layoutId: string;
	title?: string;
	when?: BundlePredicate<C>;
	root: RegionNode;
}

export type RegionNode =
	| PanelGroupRegion
	| StackRegion
	| TabsRegion
	| FloatingRegion
	| SlotRegion;

export interface PanelGroupRegion {
	type: 'panel-group';
	direction: 'horizontal' | 'vertical';
	persistKey?: string;
	children: RegionNode[];
}

export interface StackRegion {
	type: 'stack';
	direction: 'vertical' | 'horizontal';
	gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
	children: RegionNode[];
}

export interface TabsRegion {
	type: 'tabs';
	tabs: {
		key: string;
		title: string;
		child: RegionNode;
	}[];
}

export interface FloatingRegion {
	type: 'floating';
	anchorSlotId: string;
	child: RegionNode;
}

export interface SlotRegion {
	type: 'slot';
	slotId: string;
}

export interface DataRecipeSpec<C extends BundleContext = BundleContext> {
	recipeId: string;
	source:
		| { kind: 'operation'; key: string }
		| { kind: 'data-view'; key: string }
		| { kind: 'entity'; entityType: string };
	when?: BundlePredicate<C>;
	requestedDepth?: C['preferences']['dataDepth'];
	hydrateInto?: string;
	cacheTtlMs?: number;
}

export interface BundleAiSpec<C extends BundleContext = BundleContext> {
	plannerId: string;
	allowedPatchOps: SurfacePatchOp['op'][];
	plannerPrompt: string;
	maxPatchOpsPerTurn?: number;
	canAskFollowUp?: boolean;
	contextualTools?: string[];
	when?: BundlePredicate<C>;
}

export interface SurfaceAiSpec<C extends BundleContext = BundleContext> {
	assistantSlotId?: string;
	allowLayoutPatches?: boolean;
	allowSlotInsertion?: boolean;
	allowedNodeKinds?: BundleNodeKind[];
	allowedSlots?: string[];
	plannerOverrides?: Partial<BundleAiSpec<C>>;
}

export interface SurfaceVerificationSpec {
	dimensions: {
		guidance: string;
		density: string;
		dataDepth: string;
		control: string;
		media: string;
		pace: string;
		narrative: string;
	};
}

// ── Surface patch grammar ────────────────────────────────────────────────────

export interface SurfaceNode {
	nodeId: string;
	kind: BundleNodeKind;
	title?: string;
	props?: Record<string, unknown>;
	children?: SurfaceNode[];
	sourceBinding?: {
		recipeId?: string;
		entityType?: string;
		fieldId?: string;
	};
}

export type SurfacePatchOp =
	| {
			op: 'insert-node';
			slotId: string;
			node: SurfaceNode;
			index?: number;
	  }
	| {
			op: 'replace-node';
			nodeId: string;
			node: SurfaceNode;
	  }
	| {
			op: 'remove-node';
			nodeId: string;
	  }
	| {
			op: 'move-node';
			nodeId: string;
			toSlotId: string;
			index?: number;
	  }
	| {
			op: 'resize-panel';
			persistKey: string;
			sizes: number[];
	  }
	| {
			op: 'set-layout';
			layoutId: string;
	  }
	| {
			op: 'reveal-field';
			fieldId: string;
	  }
	| {
			op: 'hide-field';
			fieldId: string;
	  }
	| {
			op: 'promote-action';
			actionId: string;
			placement: 'header' | 'inline' | 'context' | 'assistant';
	  }
	| {
			op: 'set-focus';
			targetId: string;
	  };

// ── Resolution output types (04_surface_resolution_and_runtime) ──────────────

/** Preference adaptation metadata applied during resolution. */
export interface ResolvedAdaptation {
	appliedDimensions: PreferenceDimensions;
	notes: string[];
}

/** Metadata for an overlay applied during resolution. */
export interface AppliedOverlayMeta {
	overlayId: string;
	scope: BundleScope;
	appliedOps: number;
}

/** AI or workspace proposal for surface patches. */
export interface SurfacePatchProposal {
	proposalId: string;
	source: 'assistant' | 'workspace-rule' | 'session';
	ops: SurfacePatchOp[];
	approvalState: 'proposed' | 'approved' | 'rejected' | 'auto-approved';
}

// ── AI planner types (07_ai_native_chat_and_generative_ui) ────────────────────

/** Block draft for rich-doc insertion. Full BlockNote grammar deferred. */
export interface BlockDraft {
	slotId: string;
	blocks: unknown[];
}

/**
 * Planner response contract. Maps to ContractSpecAgent/AgentSpec structured output.
 * AI proposes SurfacePatchProposal objects; never emits JSX.
 */
export interface PlannerResponse {
	/** Short summary of the assistant's response. */
	summary?: string;
	/** Detected user intent (e.g. navigator, planner, explainer). */
	intent?: string;
	/** Optional follow-up question to clarify user needs. */
	followUpQuestion?: string;
	/** Tool names the assistant requested to call. */
	toolRequests?: string[];
	/** Proposed surface patches for user approval. */
	patchProposals?: SurfacePatchProposal[];
	/** Block drafts for rich-doc slots (BlockNote grammar). */
	blockDrafts?: BlockDraft[];
}

/** Audit event names for patch lifecycle. */
export type PatchAuditEvent =
	| 'patch.proposed'
	| 'patch.approved'
	| 'patch.rejected'
	| 'patch.auto-approved';

/** Payload for patch audit events. */
export interface PatchAuditPayload {
	proposalId: string;
	source: SurfacePatchProposal['source'];
	opsCount: number;
	reason?: string;
}

/** Callback for accept/reject UI. Emit audit event before applying. */
export type PatchApprovalHandler = (
	proposalId: string,
	decision: 'approved' | 'rejected',
	reason?: string
) => void;

// ── Policy and audit (10_policy_audit_and_safety) ───────────────────────────────

/** Policy effect from PDP. Aligns with spec 10_policy_audit_and_safety. */
export type PolicyEffect =
	| 'allow'
	| 'deny'
	| 'redact'
	| 'disable-with-reason'
	| 'require-approval'
	| 'allow-session-only';

/** PDP decision for a target (node, field, action, surface). */
export interface UiPolicyDecision {
	targetId: string;
	effect: PolicyEffect;
	reason?: string;
	redactions?: string[];
}

/** Bundle audit event types. Every meaningful mutation emits one. */
export type BundleAuditEventType =
	| 'surface.resolved'
	| 'patch.proposed'
	| 'patch.approved'
	| 'patch.rejected'
	| 'overlay.saved'
	| 'overlay.applied'
	| 'overlay.failed'
	| 'policy.denied'
	| 'policy.redacted';

/** Audit event shape. Integrate with lib.observability or custom logger. */
export interface BundleAuditEvent {
	eventId: string;
	at: string;
	actorId?: string;
	source: 'user' | 'assistant' | 'system' | 'policy';
	bundleKey: string;
	surfaceId?: string;
	eventType: BundleAuditEventType;
	payload: Record<string, unknown>;
}

/** Emitter for audit events. Plug into lib.observability or custom backend. */
export interface BundleAuditEmitter {
	emit(event: BundleAuditEvent): void;
}

/** Approval metadata stored with overlays for rollback. */
export interface OverlayApprovalMeta {
	approvalId: string;
	actorId: string;
	approvedAt: string;
	scope: BundleScope;
	forwardOps: SurfacePatchOp[];
	inverseOps: SurfacePatchOp[];
	reason?: string;
}
