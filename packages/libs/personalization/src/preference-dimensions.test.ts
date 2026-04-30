import { describe, expect, test } from 'bun:test';
import {
	getPreferencePresetDimensions,
	PREFERENCE_DIMENSION_PRESETS,
	PREFERENCE_PRESET_DEFINITIONS,
	recommendPreferencePreset,
} from './preference-dimensions';

describe('preference dimension presets', () => {
	test('exposes the curated baseline preset set', () => {
		expect(Object.keys(PREFERENCE_DIMENSION_PRESETS)).toEqual([
			'balanced',
			'guideMe',
			'summaryFirst',
			'deepAnalyst',
			'builder',
			'opsWarRoom',
			'auditReview',
			'minimalFocus',
		]);
		expect(PREFERENCE_DIMENSION_PRESETS.guideMe).toEqual({
			guidance: 'walkthrough',
			density: 'detailed',
			dataDepth: 'standard',
			control: 'restricted',
			media: 'hybrid',
			pace: 'deliberate',
			narrative: 'top-down',
		});
		expect(PREFERENCE_DIMENSION_PRESETS.minimalFocus.control).toBe(
			'restricted'
		);
		expect(PREFERENCE_PRESET_DEFINITIONS.deepAnalyst.intent).toContain(
			'evidence-first'
		);
	});

	test('returns a copy so callers can evolve preferences without mutating presets', () => {
		const copy = getPreferencePresetDimensions('balanced');
		copy.density = 'compact';

		expect(PREFERENCE_DIMENSION_PRESETS.balanced.density).toBe('standard');
	});
});

describe('preference preset onboarding recommendation', () => {
	test('recommends from intent signals with explainable alternatives', () => {
		const recommendation = recommendPreferencePreset({
			primaryIntent: 'analyzing',
			detailPreference: 'evidence',
			pacePreference: 'balanced',
			controlPreference: 'advanced',
			role: 'Manager',
		});

		expect(recommendation.selectedPreset).toBe('deepAnalyst');
		expect(recommendation.confidence).toBeGreaterThan(0.7);
		expect(recommendation.reasons).toContain('You are mostly analyzing.');
		expect(recommendation.reasons).toContain(
			'Role text was recorded for context but did not score presets.'
		);
		expect(recommendation.alternatives.map((alt) => alt.preset)).toContain(
			'auditReview'
		);
	});

	test('does not let role override stronger onboarding intent', () => {
		const recommendation = recommendPreferencePreset({
			primaryIntent: 'learning',
			wantsStepByStepHelp: true,
			detailPreference: 'summaries',
			role: 'Chief compliance auditor',
		});

		expect(recommendation.selectedPreset).toBe('guideMe');
		expect(recommendation.reasons).toContain(
			'You asked for step-by-step help.'
		);
	});

	test('does not let role change selection when intent signals are sparse', () => {
		const withoutRole = recommendPreferencePreset({
			mediaPreference: 'text',
		});
		const withRole = recommendPreferencePreset({
			mediaPreference: 'text',
			role: 'Developer',
		});

		expect(withRole.selectedPreset).toBe(withoutRole.selectedPreset);
		expect(withRole.reasons).toContain(
			'Role text was recorded for context but did not score presets.'
		);
	});
});
