import {
	calculateBehaviorRecommendationConfidence,
	scoreBehaviorSupportSignals,
} from './adaptive-onboarding-scores';
import type { BehaviorSupportDimension } from './behavior-support';
import {
	BEHAVIOR_SUPPORT_PRESET_DEFINITIONS,
	BEHAVIOR_SUPPORT_PRESET_IDS,
	type BehaviorSupportPresetId,
} from './behavior-support';
import type { PreferenceDimensions } from './preference-dimensions';
import {
	type PreferenceOnboardingSignals,
	type PreferencePresetAlternative,
	recommendPreferencePreset,
} from './preference-onboarding';
import type { PreferencePresetId } from './preference-presets';

export interface BehaviorSupportOnboardingSignals {
	startSupport?: 'self-start' | 'prompt' | 'guided' | 'ritual';
	actionSize?: 'tiny' | 'small' | 'standard' | 'large';
	recoveryPreference?: 'resume' | 'repair' | 'reset' | 'renegotiate';
	accountabilityPreference?: 'private' | 'self-review' | 'shared-review';
	rhythmPreference?: 'flexible' | 'steady' | 'focus-block' | 'deadline';
	meaningPreference?: 'progress' | 'mastery' | 'impact' | 'relief' | 'agency';
	reflectionPreference?: 'none' | 'brief' | 'standard' | 'deep';
	/** Weak context only. Role text must not score behavior support presets. */
	role?: string;
}

export interface BehaviorSupportPresetAlternative {
	preset: BehaviorSupportPresetId;
	confidence: number;
	reason: string;
}

export interface BehaviorSupportPresetRecommendation {
	selectedPreset: BehaviorSupportPresetId;
	confidence: number;
	reasons: string[];
	alternatives: BehaviorSupportPresetAlternative[];
	editableDimensions: BehaviorSupportDimension[];
}

export interface AdaptiveExperienceOnboardingSignals {
	interaction?: PreferenceOnboardingSignals;
	behaviorSupport?: BehaviorSupportOnboardingSignals;
}

export interface AdaptiveExperienceRecommendation {
	selectedInteractionPreset: PreferencePresetId;
	selectedBehaviorSupportPreset: BehaviorSupportPresetId;
	confidence: number;
	reasons: string[];
	alternativeInteractionPresets: PreferencePresetAlternative[];
	alternativeBehaviorSupportPresets: BehaviorSupportPresetAlternative[];
	editableDimensions: {
		interaction: (keyof PreferenceDimensions)[];
		behaviorSupport: BehaviorSupportDimension[];
	};
}

export function recommendAdaptiveExperience(
	signals: AdaptiveExperienceOnboardingSignals
): AdaptiveExperienceRecommendation {
	const interaction = recommendPreferencePreset(signals.interaction ?? {});
	const behavior = recommendBehaviorSupportPreset(
		signals.behaviorSupport ?? {}
	);
	const confidence =
		Math.round(((interaction.confidence + behavior.confidence) / 2) * 100) /
		100;

	return {
		selectedInteractionPreset: interaction.selectedPreset,
		selectedBehaviorSupportPreset: behavior.selectedPreset,
		confidence,
		reasons: [...interaction.reasons, ...behavior.reasons],
		alternativeInteractionPresets: interaction.alternatives,
		alternativeBehaviorSupportPresets: behavior.alternatives,
		editableDimensions: {
			interaction: [
				'guidance',
				'density',
				'dataDepth',
				'control',
				'media',
				'pace',
				'narrative',
			],
			behaviorSupport: behavior.editableDimensions,
		},
	};
}

export function recommendBehaviorSupportPreset(
	signals: BehaviorSupportOnboardingSignals
): BehaviorSupportPresetRecommendation {
	const { scores, reasons, signalCount } = scoreBehaviorSupportSignals(signals);

	const ranked = BEHAVIOR_SUPPORT_PRESET_IDS.map((preset) => ({
		preset,
		score: scores[preset],
	})).sort((left, right) => right.score - left.score);
	const selected = ranked[0] ?? {
		preset: 'steadyMomentum' as const,
		score: 1,
	};
	const second = ranked[1]?.score ?? 0;

	return {
		selectedPreset: selected.preset,
		confidence: calculateBehaviorRecommendationConfidence(
			selected.score,
			second,
			signalCount
		),
		reasons: reasons.length
			? Array.from(new Set(reasons))
			: ['Steady momentum is the default when support signals are sparse.'],
		alternatives: ranked.slice(1, 4).map(({ preset, score }) => ({
			preset,
			confidence: calculateBehaviorRecommendationConfidence(
				score,
				0,
				signalCount
			),
			reason: BEHAVIOR_SUPPORT_PRESET_DEFINITIONS[preset].intent,
		})),
		editableDimensions: [
			'attention',
			'activation',
			'actionScale',
			'rhythm',
			'environment',
			'challenge',
			'meaningFrame',
			'permission',
			'selfAuthority',
			'accountability',
			'recovery',
			'reflection',
		],
	};
}
