export type AdaptiveScopeLevel = 'surface' | 'workflow' | 'workspace' | 'user';

export type BehaviorSignalConfidence = 'low' | 'medium' | 'high';
export type BehaviorSignalSafetyLevel = 'safe' | 'review' | 'high-impact';

export type BehaviorSignalKind =
	| 'baseline'
	| 'repeated_pattern'
	| 'deviation'
	| 'signal_cluster'
	| 'user_feedback';

export type BehaviorSignalSource =
	| 'direct-interaction'
	| 'explicit-feedback'
	| 'system-observation'
	| 'imported';

export interface AdaptiveScope {
	level: AdaptiveScopeLevel;
	id?: string;
}

export interface BehaviorSignalTimeWindow {
	start: string;
	end?: string;
}

export interface BehaviorSuggestedAdaptation {
	id: string;
	label: string;
	description: string;
	target: 'preference' | 'behaviorSupport' | 'runtimeAction';
	dimension?: string;
	value?: string;
	scope: AdaptiveScope;
	impact: 'low' | 'medium' | 'high';
	requiresConfirmation?: boolean;
}

export interface BehaviorSignalEvidence {
	baseline?: string;
	repeatedPattern?: string;
	deviationFromBaseline?: string;
	signalCluster?: string[];
	timeWindow: BehaviorSignalTimeWindow;
	scope: AdaptiveScope;
	confidence: BehaviorSignalConfidence;
	source: BehaviorSignalSource;
	userFeedback?: 'accepted' | 'rejected' | 'corrected' | 'not-asked';
	suggestedAdaptation?: BehaviorSuggestedAdaptation;
	safetyLevel: BehaviorSignalSafetyLevel;
	observations: string[];
}

export interface BehaviorSignalModel {
	id: string;
	kind: BehaviorSignalKind;
	summary: string;
	evidence: BehaviorSignalEvidence;
	prohibitedConclusions: string[];
	createdAt?: string;
}

export const UNSAFE_BEHAVIOR_LABELS = [
	'lazy',
	'avoidant',
	'anxious',
	'weak discipline',
	'low motivation',
	'needy',
	'approval-seeking',
	'procrastinator',
	'high-value user',
	'low-value user',
	'compliant user',
	'manipulable user',
	'unreliable',
	'low-performing',
] as const;

export type UnsafeBehaviorLabel = (typeof UNSAFE_BEHAVIOR_LABELS)[number];

export function findUnsafeBehaviorLanguage(
	values: string[]
): UnsafeBehaviorLabel[] {
	const haystack = values.join(' ').toLowerCase();
	return UNSAFE_BEHAVIOR_LABELS.filter((label) => haystack.includes(label));
}

export function createBehaviorSignalModel(
	signal: Omit<BehaviorSignalModel, 'prohibitedConclusions'>
): BehaviorSignalModel {
	const unsafeLabels = findUnsafeBehaviorLanguage([
		signal.summary,
		...signal.evidence.observations,
		signal.evidence.baseline ?? '',
		signal.evidence.repeatedPattern ?? '',
		signal.evidence.deviationFromBaseline ?? '',
	]);
	if (unsafeLabels.length > 0) {
		throw new Error(
			`Behavior signals must describe observations, not unsafe labels: ${unsafeLabels.join(
				', '
			)}`
		);
	}
	return {
		...signal,
		prohibitedConclusions: [
			'Do not infer personality, morality, discipline, clinical state, or user value from this signal.',
			'Use this signal only as scoped evidence for explainable adaptation suggestions.',
		],
	};
}
