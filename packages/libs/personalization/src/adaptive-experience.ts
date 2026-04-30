import type {
	AdaptiveScope,
	BehaviorSignalModel,
	BehaviorSignalSafetyLevel,
} from './behavior-signals';
import type { BehaviorSupportDimensions } from './behavior-support';
import type { PreferenceDimensions } from './preference-dimensions';

export interface AdaptiveExperienceContext {
	surfaceId?: string;
	workflowId?: string;
	workspaceId?: string;
	userIntent?: string;
	currentSurface?: string;
	timestamp?: string;
}

export interface AdaptiveExperiencePermission {
	key: string;
	allowed: boolean;
	reason?: string;
}

export interface AdaptiveExperienceConstraint {
	id: string;
	reason: string;
	target?: string;
	blocksAdaptation?: boolean;
}

export interface AdaptiveExperiencePolicy {
	id: string;
	effect: 'allow' | 'constrain' | 'block' | 'require-confirmation';
	reason: string;
	target?: string;
}

export interface AdaptiveExperienceOverride {
	target: 'preference' | 'behaviorSupport' | 'runtimeAction';
	key: string;
	value: unknown;
	reason?: string;
}

export interface AdaptiveExperienceAction {
	id: string;
	kind: 'ui' | 'guidance' | 'next-action' | 'recovery' | 'focus' | 'reflection';
	scope: AdaptiveScope;
	description: string;
	requiresConfirmation: boolean;
	reversible: boolean;
	evidenceIds: string[];
	safetyLevel: BehaviorSignalSafetyLevel;
}

export interface SuppressedAdaptiveExperienceAction
	extends AdaptiveExperienceAction {
	suppressedReason: string;
}

export interface ResolveAdaptiveExperienceInput {
	preferences: PreferenceDimensions;
	behaviorSupport: BehaviorSupportDimensions;
	behaviorSignals?: BehaviorSignalModel[];
	context?: AdaptiveExperienceContext;
	permissions?: AdaptiveExperiencePermission[];
	constraints?: AdaptiveExperienceConstraint[];
	policies?: AdaptiveExperiencePolicy[];
	overrides?: AdaptiveExperienceOverride[];
}

export interface ResolvedAdaptiveExperience {
	interaction: PreferenceDimensions;
	behaviorSupport: BehaviorSupportDimensions;
	context: AdaptiveExperienceContext;
	appliedAdaptations: AdaptiveExperienceAction[];
	suppressedAdaptations: SuppressedAdaptiveExperienceAction[];
	reasons: string[];
	evidenceIds: string[];
	constraints: AdaptiveExperienceConstraint[];
	permissions: AdaptiveExperiencePermission[];
	policies: AdaptiveExperiencePolicy[];
	overrides: AdaptiveExperienceOverride[];
	persistence: 'runtime-only';
	canUndo: boolean;
	userFacingSummary: string;
}

export function resolveAdaptiveExperience({
	preferences,
	behaviorSupport,
	behaviorSignals = [],
	context = {},
	permissions = [],
	constraints = [],
	policies = [],
	overrides = [],
}: ResolveAdaptiveExperienceInput): ResolvedAdaptiveExperience {
	const candidateActions = behaviorSignals.flatMap(signalToAction);
	const appliedAdaptations: AdaptiveExperienceAction[] = [];
	const suppressedAdaptations: SuppressedAdaptiveExperienceAction[] = [];

	for (const action of candidateActions) {
		const controlledAction = applyConfirmationControls(
			action,
			policies,
			overrides
		);
		const suppressedReason = getSuppressionReason(
			controlledAction,
			permissions,
			constraints,
			policies,
			overrides
		);
		if (suppressedReason) {
			suppressedAdaptations.push({ ...controlledAction, suppressedReason });
		} else {
			appliedAdaptations.push(controlledAction);
		}
	}

	const evidenceIds = behaviorSignals.map((signal) => signal.id);
	const reasons = buildResolvedReasons({
		appliedAdaptations,
		suppressedAdaptations,
		overrides,
	});

	return {
		interaction: { ...preferences },
		behaviorSupport: { ...behaviorSupport },
		context: { ...context },
		appliedAdaptations,
		suppressedAdaptations,
		reasons,
		evidenceIds,
		constraints: constraints.map((constraint) => ({ ...constraint })),
		permissions: permissions.map((permission) => ({ ...permission })),
		policies: policies.map((policy) => ({ ...policy })),
		overrides: overrides.map((override) => ({ ...override })),
		persistence: 'runtime-only',
		canUndo: true,
		userFacingSummary:
			'This runtime result explains what changed, why it changed, and how it can be undone.',
	};
}

function signalToAction(
	signal: BehaviorSignalModel
): AdaptiveExperienceAction[] {
	const adaptation = signal.evidence.suggestedAdaptation;
	if (!adaptation) return [];
	return [
		{
			id: adaptation.id,
			kind: inferActionKind(adaptation.target, adaptation.dimension),
			scope: adaptation.scope,
			description: adaptation.description,
			requiresConfirmation:
				(adaptation.requiresConfirmation ?? adaptation.impact !== 'low') ||
				signal.evidence.safetyLevel !== 'safe',
			reversible: true,
			evidenceIds: [signal.id],
			safetyLevel: signal.evidence.safetyLevel,
		},
	];
}

function inferActionKind(
	target: string,
	dimension?: string
): AdaptiveExperienceAction['kind'] {
	if (target === 'preference') return 'ui';
	if (dimension === 'recovery') return 'recovery';
	if (dimension === 'reflection') return 'reflection';
	if (dimension === 'environment') return 'focus';
	if (target === 'behaviorSupport') return 'next-action';
	return 'guidance';
}

function getSuppressionReason(
	action: AdaptiveExperienceAction,
	permissions: AdaptiveExperiencePermission[],
	constraints: AdaptiveExperienceConstraint[],
	policies: AdaptiveExperiencePolicy[],
	overrides: AdaptiveExperienceOverride[]
): string | undefined {
	const disablingOverride = overrides.find(
		(override) =>
			override.target === 'runtimeAction' &&
			actionMatchesTarget(action, override.key) &&
			override.value === false
	);
	if (disablingOverride) {
		return (
			disablingOverride.reason ?? 'Explicit override disabled this action.'
		);
	}

	const deniedPermission = permissions.find(
		(permission) => !permission.allowed && action.id.includes(permission.key)
	);
	if (deniedPermission) return deniedPermission.reason ?? 'Permission denied.';

	const blockingConstraint = constraints.find(
		(constraint) =>
			constraint.blocksAdaptation &&
			(!constraint.target || action.id.includes(constraint.target))
	);
	if (blockingConstraint) return blockingConstraint.reason;

	const blockingPolicy = policies.find(
		(policy) =>
			policy.effect === 'block' &&
			(!policy.target || action.id.includes(policy.target))
	);
	if (blockingPolicy) return blockingPolicy.reason;

	return undefined;
}

function applyConfirmationControls(
	action: AdaptiveExperienceAction,
	policies: AdaptiveExperiencePolicy[],
	overrides: AdaptiveExperienceOverride[]
): AdaptiveExperienceAction {
	const needsPolicyConfirmation = policies.some(
		(policy) =>
			(policy.effect === 'require-confirmation' ||
				policy.effect === 'constrain') &&
			(!policy.target || actionMatchesTarget(action, policy.target))
	);
	const needsOverrideConfirmation = overrides.some(
		(override) =>
			override.target === 'runtimeAction' &&
			actionMatchesTarget(action, override.key) &&
			(override.value === 'require-confirmation' ||
				override.value === 'confirm')
	);
	if (!needsPolicyConfirmation && !needsOverrideConfirmation) return action;
	return { ...action, requiresConfirmation: true };
}

function actionMatchesTarget(
	action: AdaptiveExperienceAction,
	target: string
): boolean {
	return action.id.includes(target) || action.kind === target;
}

function buildResolvedReasons(input: {
	appliedAdaptations: AdaptiveExperienceAction[];
	suppressedAdaptations: SuppressedAdaptiveExperienceAction[];
	overrides: AdaptiveExperienceOverride[];
}): string[] {
	const reasons = [
		'Resolved adaptive experience is runtime-only and should not be stored as a hidden user profile.',
		'Permissions, constraints, policy, and explicit overrides bound all adaptation.',
	];
	if (input.appliedAdaptations.length > 0) {
		reasons.push(
			'Scoped behavior evidence produced explainable runtime actions.'
		);
	}
	if (input.suppressedAdaptations.length > 0) {
		reasons.push(
			'Some suggested adaptations were suppressed by safety boundaries.'
		);
	}
	if (input.overrides.length > 0) {
		reasons.push(
			'Explicit overrides were preserved as higher priority context.'
		);
	}
	return reasons;
}
