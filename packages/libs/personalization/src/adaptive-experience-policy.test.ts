import { describe, expect, test } from 'bun:test';
import {
	BEHAVIOR_SUPPORT_PRESETS,
	createBehaviorSignalModel,
	PREFERENCE_DIMENSION_PRESETS,
	resolveAdaptiveExperience,
} from './preference-dimensions';

describe('adaptive experience policy controls', () => {
	test('requires confirmation when a matching policy says so', () => {
		const resolved = resolveAdaptiveExperience({
			preferences: PREFERENCE_DIMENSION_PRESETS.balanced,
			behaviorSupport: BEHAVIOR_SUPPORT_PRESETS.steadyMomentum,
			behaviorSignals: [smallStepSignal()],
			policies: [
				{
					id: 'confirm-next-actions',
					effect: 'require-confirmation',
					target: 'smaller-next-action',
					reason: 'Confirm behavior support changes in this workflow.',
				},
			],
		});

		expect(resolved.appliedAdaptations[0]?.requiresConfirmation).toBe(true);
	});

	test('suppresses runtime actions disabled by explicit override', () => {
		const resolved = resolveAdaptiveExperience({
			preferences: PREFERENCE_DIMENSION_PRESETS.balanced,
			behaviorSupport: BEHAVIOR_SUPPORT_PRESETS.steadyMomentum,
			behaviorSignals: [smallStepSignal()],
			overrides: [
				{
					target: 'runtimeAction',
					key: 'smaller-next-action',
					value: false,
					reason: 'User disabled smaller next-action suggestions here.',
				},
			],
		});

		expect(resolved.appliedAdaptations).toEqual([]);
		expect(resolved.suppressedAdaptations[0]?.suppressedReason).toBe(
			'User disabled smaller next-action suggestions here.'
		);
	});
});

function smallStepSignal() {
	return createBehaviorSignalModel({
		id: 'signal-small-first-step',
		kind: 'repeated_pattern',
		summary: 'User completes smaller first actions more often.',
		evidence: {
			repeatedPattern: 'Completed small first actions in three sessions.',
			timeWindow: { start: '2026-04-01T00:00:00Z' },
			scope: { level: 'workflow', id: 'review' },
			confidence: 'high',
			source: 'system-observation',
			safetyLevel: 'safe',
			observations: [
				'Completed small first action in session 1.',
				'Completed small first action in session 2.',
				'Completed small first action in session 3.',
			],
			suggestedAdaptation: {
				id: 'smaller-next-action',
				label: 'Use smaller first steps',
				description: 'Recommend a smaller next action for this workflow.',
				target: 'behaviorSupport',
				dimension: 'actionScale',
				value: 'small',
				scope: { level: 'workflow', id: 'review' },
				impact: 'low',
			},
		},
	});
}
