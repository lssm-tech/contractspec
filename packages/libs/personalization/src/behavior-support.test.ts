import { describe, expect, test } from 'bun:test';
import {
	BEHAVIOR_SUPPORT_PRESET_DEFINITIONS,
	BEHAVIOR_SUPPORT_PRESETS,
	findUnsafeBehaviorLanguage,
	getBehaviorSupportPresetDimensions,
	recommendAdaptiveExperience,
} from './preference-dimensions';

describe('behavior support presets', () => {
	test('exposes editable support styles without identity framing', () => {
		expect(Object.keys(BEHAVIOR_SUPPORT_PRESETS)).toEqual([
			'steadyMomentum',
			'activationFirst',
			'permissionFirst',
			'deepWorkBuilder',
			'recoveryFirst',
			'identityBuilder',
			'selfAuthorityBuilder',
			'socialMomentum',
			'deadlineSprint',
			'minimalNudge',
		]);
		expect(BEHAVIOR_SUPPORT_PRESETS.recoveryFirst).toMatchObject({
			activation: 'guided-start',
			actionScale: 'small',
			recovery: 'repair',
			accountability: 'private',
		});
		expect(BEHAVIOR_SUPPORT_PRESET_DEFINITIONS.recoveryFirst.intent).toContain(
			'repair and resumption'
		);
		expect(
			findUnsafeBehaviorLanguage(
				Object.values(BEHAVIOR_SUPPORT_PRESET_DEFINITIONS).flatMap((preset) => [
					preset.label,
					preset.intent,
				])
			)
		).toEqual([]);
	});

	test('returns copies so callers can edit support dimensions safely', () => {
		const copy = getBehaviorSupportPresetDimensions('steadyMomentum');
		copy.actionScale = 'tiny';

		expect(BEHAVIOR_SUPPORT_PRESETS.steadyMomentum.actionScale).toBe(
			'standard'
		);
	});
});

describe('adaptive onboarding recommendation', () => {
	test('recommends interaction and support presets without scoring role text', () => {
		const recommendation = recommendAdaptiveExperience({
			interaction: {
				primaryIntent: 'reviewing',
				detailPreference: 'evidence',
				role: 'Director',
			},
			behaviorSupport: {
				startSupport: 'guided',
				actionSize: 'small',
				recoveryPreference: 'repair',
				role: 'Director',
			},
		});

		expect(recommendation.selectedInteractionPreset).toBe('auditReview');
		expect(recommendation.selectedBehaviorSupportPreset).toBe('recoveryFirst');
		expect(recommendation.reasons).toContain(
			'Role text was recorded for context but did not score presets.'
		);
		expect(recommendation.reasons).toContain(
			'Role text was recorded for context but did not score support presets.'
		);
		expect(recommendation.editableDimensions.behaviorSupport).toContain(
			'recovery'
		);
	});
});
