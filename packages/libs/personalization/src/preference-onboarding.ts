import {
	PREFERENCE_PRESET_DEFINITIONS,
	PREFERENCE_PRESET_IDS,
	type PreferencePresetId,
} from './preference-presets';

export type OnboardingPrimaryIntent =
	| 'general'
	| 'learning'
	| 'reviewing'
	| 'building'
	| 'monitoring'
	| 'analyzing';

export interface PreferenceOnboardingSignals {
	wantsStepByStepHelp?: boolean;
	detailPreference?: 'summaries' | 'details' | 'evidence';
	pacePreference?: 'fast' | 'balanced' | 'deliberate';
	controlPreference?: 'simple' | 'standard' | 'advanced';
	primaryIntent?: OnboardingPrimaryIntent;
	mediaPreference?: 'text' | 'visual' | 'hybrid';
	/** Weak tie-breaker only. Never use role as the primary decision input. */
	role?: string;
}

export interface PreferencePresetAlternative {
	preset: PreferencePresetId;
	confidence: number;
	reason: string;
}

export interface PreferencePresetRecommendation {
	selectedPreset: PreferencePresetId;
	confidence: number;
	reasons: string[];
	alternatives: PreferencePresetAlternative[];
}

type PresetScores = Record<PreferencePresetId, number>;

export function recommendPreferencePreset(
	signals: PreferenceOnboardingSignals
): PreferencePresetRecommendation {
	const scores = initialScores();
	const reasons: string[] = [];
	let signalCount = 0;

	const add = (
		preset: PreferencePresetId,
		points: number,
		reason?: string
	): void => {
		scores[preset] += points;
		if (reason) reasons.push(reason);
	};

	if (signals.primaryIntent) {
		signalCount += 1;
		scoreIntent(signals.primaryIntent, add);
	}
	if (signals.wantsStepByStepHelp !== undefined) {
		signalCount += 1;
		if (signals.wantsStepByStepHelp) {
			add('guideMe', 4, 'You asked for step-by-step help.');
		} else {
			add('minimalFocus', 1.5, 'You did not ask for guided walkthroughs.');
			add('builder', 1);
		}
	}
	if (signals.detailPreference) {
		signalCount += 1;
		scoreDetails(signals.detailPreference, add);
	}
	if (signals.pacePreference) {
		signalCount += 1;
		scorePace(signals.pacePreference, add);
	}
	if (signals.controlPreference) {
		signalCount += 1;
		scoreControl(signals.controlPreference, add);
	}
	if (signals.mediaPreference) {
		signalCount += 1;
		scoreMedia(signals.mediaPreference, add);
	}
	if (signals.role) {
		reasons.push(
			'Role text was recorded for context but did not score presets.'
		);
	}

	const ranked = PREFERENCE_PRESET_IDS.map((preset) => ({
		preset,
		score: scores[preset],
	})).sort((left, right) => right.score - left.score);
	const selected = ranked[0] ?? { preset: 'balanced' as const, score: 1 };
	const second = ranked[1]?.score ?? 0;
	const confidence = calculateRecommendationConfidence(
		selected.score,
		second,
		signalCount
	);

	return {
		selectedPreset: selected.preset,
		confidence,
		reasons: reasons.length
			? unique(reasons)
			: ['Balanced is the default when onboarding signals are sparse.'],
		alternatives: ranked.slice(1, 4).map(({ preset, score }) => ({
			preset,
			confidence: calculateRecommendationConfidence(score, 0, signalCount),
			reason: PREFERENCE_PRESET_DEFINITIONS[preset].intent,
		})),
	};
}

function initialScores(): PresetScores {
	return PREFERENCE_PRESET_IDS.reduce(
		(scores, preset) => ({
			...scores,
			[preset]: preset === 'balanced' ? 1 : 0,
		}),
		{} as PresetScores
	);
}

function scoreIntent(
	intent: OnboardingPrimaryIntent,
	add: (preset: PreferencePresetId, points: number, reason?: string) => void
): void {
	if (intent === 'general')
		add('balanced', 3, 'You chose a general-purpose setup.');
	if (intent === 'learning') add('guideMe', 4, 'You are mostly learning.');
	if (intent === 'reviewing')
		add('auditReview', 4, 'You are mostly reviewing.');
	if (intent === 'building') add('builder', 4, 'You are mostly building.');
	if (intent === 'monitoring')
		add('opsWarRoom', 4, 'You are mostly monitoring.');
	if (intent === 'analyzing')
		add('deepAnalyst', 4, 'You are mostly analyzing.');
}

function scoreDetails(
	detail: NonNullable<PreferenceOnboardingSignals['detailPreference']>,
	add: (preset: PreferencePresetId, points: number, reason?: string) => void
): void {
	if (detail === 'summaries') {
		add('summaryFirst', 4, 'You prefer to scan summaries first.');
		add('minimalFocus', 2);
	}
	if (detail === 'details') {
		add('deepAnalyst', 2, 'You prefer to inspect details.');
		add('auditReview', 2);
	}
	if (detail === 'evidence') {
		add('deepAnalyst', 4, 'You prefer evidence before summaries.');
		add('auditReview', 3);
	}
}

function scorePace(
	pace: NonNullable<PreferenceOnboardingSignals['pacePreference']>,
	add: (preset: PreferencePresetId, points: number, reason?: string) => void
): void {
	if (pace === 'fast') {
		add('opsWarRoom', 3, 'You prefer a fast interface.');
		add('summaryFirst', 2);
		add('builder', 2);
	}
	if (pace === 'balanced') add('balanced', 2, 'You prefer a balanced pace.');
	if (pace === 'deliberate') {
		add('auditReview', 3, 'You prefer a deliberate pace.');
		add('guideMe', 2);
	}
}

function scoreControl(
	control: NonNullable<PreferenceOnboardingSignals['controlPreference']>,
	add: (preset: PreferencePresetId, points: number, reason?: string) => void
): void {
	if (control === 'simple') {
		add('minimalFocus', 3, 'You prefer simple controls.');
		add('guideMe', 2);
	}
	if (control === 'standard')
		add('balanced', 2, 'You prefer standard controls.');
	if (control === 'advanced') {
		add('builder', 3, 'You prefer advanced control.');
		add('deepAnalyst', 2);
		add('opsWarRoom', 2);
		add('auditReview', 2);
	}
}

function scoreMedia(
	media: NonNullable<PreferenceOnboardingSignals['mediaPreference']>,
	add: (preset: PreferencePresetId, points: number) => void
): void {
	if (media === 'visual') {
		add('opsWarRoom', 2);
		add('summaryFirst', 1);
	}
	if (media === 'text') {
		add('minimalFocus', 1);
		add('builder', 1);
		add('auditReview', 1);
	}
	if (media === 'hybrid') {
		add('balanced', 1);
		add('guideMe', 1);
		add('deepAnalyst', 1);
	}
}

function calculateRecommendationConfidence(
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

function unique(values: string[]): string[] {
	return Array.from(new Set(values));
}
