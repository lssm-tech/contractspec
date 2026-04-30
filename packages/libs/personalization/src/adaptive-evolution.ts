import type { BehaviorSignalModel } from './behavior-signals';
import type {
	BehaviorSupportDimension,
	BehaviorSupportDimensions,
	BehaviorSupportDimensionValue,
} from './behavior-support';
import type { PreferenceDimensions } from './preference-dimensions';
import {
	type PreferenceEvolutionInput,
	type PreferenceEvolutionSuggestion,
	suggestPreferenceEvolution,
} from './preference-evolution';

export interface AdaptiveExperienceEvolutionInput {
	currentPreferences: PreferenceDimensions;
	currentBehaviorSupport: BehaviorSupportDimensions;
	preferenceObservations?: PreferenceEvolutionInput['observations'];
	behaviorSignals?: BehaviorSignalModel[];
	preferredScope?: PreferenceEvolutionInput['preferredScope'];
}

export interface BehaviorSupportEvolutionEvidence {
	signalIds: string[];
	confidence: 'low' | 'medium' | 'high';
	observations: string[];
}

export interface BehaviorSupportEvolutionSuggestion {
	id: string;
	dimension: BehaviorSupportDimension;
	from: BehaviorSupportDimensionValue;
	to: BehaviorSupportDimensionValue;
	scope: 'surface' | 'workflow' | 'workspace' | 'user';
	requiresConfirmation: boolean;
	reversible: true;
	automatic: false;
	reasons: string[];
	evidence: BehaviorSupportEvolutionEvidence;
	patch: Partial<BehaviorSupportDimensions>;
}

export interface SuppressedAdaptiveEvolutionSuggestion {
	id: string;
	reason: string;
	signalIds: string[];
}

export interface AdaptiveExperienceEvolutionResult {
	preferenceSuggestions: PreferenceEvolutionSuggestion[];
	behaviorSupportSuggestions: BehaviorSupportEvolutionSuggestion[];
	suppressedSuggestions: SuppressedAdaptiveEvolutionSuggestion[];
}

const SENSITIVE_BEHAVIOR_SUPPORT_DIMENSIONS = new Set<BehaviorSupportDimension>(
	['challenge', 'accountability', 'environment']
);

export function suggestAdaptiveExperienceEvolution({
	currentPreferences,
	currentBehaviorSupport,
	preferenceObservations = [],
	behaviorSignals = [],
	preferredScope = 'surface',
}: AdaptiveExperienceEvolutionInput): AdaptiveExperienceEvolutionResult {
	const preferenceSuggestions = suggestPreferenceEvolution({
		current: currentPreferences,
		observations: preferenceObservations,
		preferredScope,
	});
	const behaviorResult = suggestBehaviorSupportEvolution({
		currentBehaviorSupport,
		behaviorSignals,
	});

	return {
		preferenceSuggestions,
		behaviorSupportSuggestions: behaviorResult.suggestions,
		suppressedSuggestions: behaviorResult.suppressed,
	};
}

function suggestBehaviorSupportEvolution({
	currentBehaviorSupport,
	behaviorSignals,
}: Pick<
	AdaptiveExperienceEvolutionInput,
	'currentBehaviorSupport' | 'behaviorSignals'
>): {
	suggestions: BehaviorSupportEvolutionSuggestion[];
	suppressed: SuppressedAdaptiveEvolutionSuggestion[];
} {
	const suggestions: BehaviorSupportEvolutionSuggestion[] = [];
	const suppressed: SuppressedAdaptiveEvolutionSuggestion[] = [];

	for (const signal of behaviorSignals ?? []) {
		const adaptation = signal.evidence.suggestedAdaptation;
		if (!adaptation || adaptation.target !== 'behaviorSupport') continue;
		const dimension = adaptation.dimension as BehaviorSupportDimension;
		if (!isBehaviorSupportDimension(dimension)) {
			suppressed.push({
				id: adaptation.id,
				reason: 'Suggested behavior support dimension is not recognized.',
				signalIds: [signal.id],
			});
			continue;
		}
		if (!isBehaviorSupportValue(dimension, adaptation.value)) {
			suppressed.push({
				id: adaptation.id,
				reason:
					'Suggested behavior support value does not match the dimension.',
				signalIds: [signal.id],
			});
			continue;
		}
		const to = adaptation.value;
		if (to === currentBehaviorSupport[dimension]) continue;
		const requiresConfirmation =
			(adaptation.requiresConfirmation ?? adaptation.impact !== 'low') ||
			SENSITIVE_BEHAVIOR_SUPPORT_DIMENSIONS.has(dimension);
		suggestions.push({
			id: adaptation.id,
			dimension,
			from: currentBehaviorSupport[dimension],
			to,
			scope: adaptation.scope.level,
			requiresConfirmation,
			reversible: true,
			automatic: false,
			reasons: buildBehaviorSupportReasons(signal, dimension),
			evidence: {
				signalIds: [signal.id],
				confidence: signal.evidence.confidence,
				observations: signal.evidence.observations,
			},
			patch: { [dimension]: to },
		} as BehaviorSupportEvolutionSuggestion);
	}

	return { suggestions, suppressed };
}

function buildBehaviorSupportReasons(
	signal: BehaviorSignalModel,
	dimension: BehaviorSupportDimension
): string[] {
	const reasons = [
		'Behavior support changes are suggestions, not silent mutations.',
		'The signal describes scoped observed behavior, not a user identity.',
		'The suggestion is reversible and should be explainable in the UI.',
	];
	if (SENSITIVE_BEHAVIOR_SUPPORT_DIMENSIONS.has(dimension)) {
		reasons.push(
			'Changes to challenge, accountability, or social exposure require confirmation.'
		);
	}
	if (signal.evidence.userFeedback) {
		reasons.push(`User feedback state: ${signal.evidence.userFeedback}.`);
	}
	return reasons;
}

const BEHAVIOR_SUPPORT_DIMENSION_VALUES: Record<
	BehaviorSupportDimension,
	readonly string[]
> = {
	attention: ['ambient', 'next-step', 'priority', 'review'],
	activation: ['self-start', 'prompted', 'guided-start', 'ritual'],
	actionScale: ['tiny', 'small', 'standard', 'large'],
	rhythm: ['flexible', 'steady', 'time-boxed', 'deadline-driven'],
	environment: ['open', 'structured', 'focused', 'collaborative'],
	challenge: ['low', 'moderate', 'stretch', 'high'],
	meaningFrame: [
		'progress',
		'mastery',
		'impact',
		'relief',
		'belonging',
		'agency',
	],
	permission: ['proceed', 'start-smaller', 'pause', 'renegotiate'],
	selfAuthority: [
		'light',
		'structured',
		'confidence-building',
		'high-autonomy',
	],
	accountability: ['private', 'self-review', 'peer-review', 'external-review'],
	recovery: ['resume', 'repair', 'reset', 'renegotiate'],
	reflection: ['none', 'brief', 'standard', 'deep'],
};

function isBehaviorSupportDimension(
	value: string
): value is BehaviorSupportDimension {
	return Object.prototype.hasOwnProperty.call(
		BEHAVIOR_SUPPORT_DIMENSION_VALUES,
		value
	);
}

function isBehaviorSupportValue<Dimension extends BehaviorSupportDimension>(
	dimension: Dimension,
	value: string | undefined
): value is BehaviorSupportDimensions[Dimension] {
	return value
		? BEHAVIOR_SUPPORT_DIMENSION_VALUES[dimension].includes(value)
		: false;
}
