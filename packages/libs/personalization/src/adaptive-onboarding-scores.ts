import type { BehaviorSupportOnboardingSignals } from './adaptive-onboarding';
import {
	BEHAVIOR_SUPPORT_PRESET_IDS,
	type BehaviorSupportPresetId,
} from './behavior-support';

export type BehaviorSupportPresetScores = Record<
	BehaviorSupportPresetId,
	number
>;

type ScoreAdd = (
	preset: BehaviorSupportPresetId,
	points: number,
	reason?: string
) => void;

export function scoreBehaviorSupportSignals(
	signals: BehaviorSupportOnboardingSignals
): {
	scores: BehaviorSupportPresetScores;
	reasons: string[];
	signalCount: number;
} {
	const scores = initialBehaviorScores();
	const reasons: string[] = [];
	let signalCount = 0;
	const add: ScoreAdd = (preset, points, reason) => {
		scores[preset] += points;
		if (reason) reasons.push(reason);
	};

	if (signals.startSupport) {
		signalCount += 1;
		scoreStartSupport(signals.startSupport, add);
	}
	if (signals.actionSize) {
		signalCount += 1;
		scoreActionSize(signals.actionSize, add);
	}
	if (signals.recoveryPreference) {
		signalCount += 1;
		scoreRecovery(signals.recoveryPreference, add);
	}
	if (signals.accountabilityPreference) {
		signalCount += 1;
		scoreAccountability(signals.accountabilityPreference, add);
	}
	if (signals.rhythmPreference) {
		signalCount += 1;
		scoreRhythm(signals.rhythmPreference, add);
	}
	if (signals.meaningPreference) {
		signalCount += 1;
		scoreMeaning(signals.meaningPreference, add);
	}
	if (signals.reflectionPreference) {
		signalCount += 1;
		scoreReflection(signals.reflectionPreference, add);
	}
	if (signals.role) {
		reasons.push(
			'Role text was recorded for context but did not score support presets.'
		);
	}

	return { scores, reasons, signalCount };
}

export function calculateBehaviorRecommendationConfidence(
	score: number,
	nextScore: number,
	signalCount: number
): number {
	if (signalCount === 0) return 0.35;
	const confidence =
		0.45 +
		Math.min(score / (signalCount * 4), 0.4) +
		Math.min((score - nextScore) * 0.05, 0.15);
	return Math.round(Math.min(confidence, 0.95) * 100) / 100;
}

function initialBehaviorScores(): BehaviorSupportPresetScores {
	return BEHAVIOR_SUPPORT_PRESET_IDS.reduce(
		(scores, preset) => ({
			...scores,
			[preset]: preset === 'steadyMomentum' ? 1 : 0,
		}),
		{} as BehaviorSupportPresetScores
	);
}

function scoreStartSupport(value: string, add: ScoreAdd): void {
	if (value === 'self-start')
		add('minimalNudge', 4, 'You prefer low-noise starts.');
	if (value === 'prompt')
		add('steadyMomentum', 3, 'You prefer a clear prompt to begin.');
	if (value === 'guided')
		add('activationFirst', 4, 'You prefer guided start support.');
	if (value === 'ritual')
		add('deepWorkBuilder', 4, 'You prefer a repeatable start ritual.');
}

function scoreActionSize(value: string, add: ScoreAdd): void {
	if (value === 'tiny')
		add('activationFirst', 3, 'Tiny first steps feel easier to trust.');
	if (value === 'small')
		add('permissionFirst', 3, 'Small first steps feel easier to trust.');
	if (value === 'standard')
		add('steadyMomentum', 2, 'Standard next actions fit you.');
	if (value === 'large')
		add('deepWorkBuilder', 2, 'You prefer substantial action blocks.');
}

function scoreRecovery(value: string, add: ScoreAdd): void {
	if (value === 'repair')
		add('recoveryFirst', 5, 'Repair should be easy after a miss.');
	if (value === 'renegotiate')
		add('permissionFirst', 4, 'Renegotiation should stay available.');
	if (value === 'resume')
		add('steadyMomentum', 2, 'You prefer to resume without a reset.');
	if (value === 'reset')
		add('activationFirst', 2, 'A clean restart can be useful.');
}

function scoreAccountability(value: string, add: ScoreAdd): void {
	if (value === 'private')
		add('minimalNudge', 3, 'You prefer private progress.');
	if (value === 'self-review')
		add('selfAuthorityBuilder', 3, 'You prefer self-review.');
	if (value === 'shared-review')
		add('socialMomentum', 4, 'You prefer shared review.');
}

function scoreRhythm(value: string, add: ScoreAdd): void {
	if (value === 'flexible') add('permissionFirst', 2);
	if (value === 'steady') add('steadyMomentum', 3);
	if (value === 'focus-block') add('deepWorkBuilder', 4);
	if (value === 'deadline') add('deadlineSprint', 4);
}

function scoreMeaning(value: string, add: ScoreAdd): void {
	if (value === 'mastery') add('deepWorkBuilder', 3);
	if (value === 'impact') add('deadlineSprint', 2);
	if (value === 'relief') add('recoveryFirst', 3);
	if (value === 'agency') add('identityBuilder', 3);
	if (value === 'progress') add('steadyMomentum', 2);
}

function scoreReflection(value: string, add: ScoreAdd): void {
	if (value === 'none') add('minimalNudge', 3);
	if (value === 'brief') add('steadyMomentum', 2);
	if (value === 'standard') add('selfAuthorityBuilder', 2);
	if (value === 'deep') add('deepWorkBuilder', 3);
}
