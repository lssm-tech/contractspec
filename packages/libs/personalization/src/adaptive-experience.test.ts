import { describe, expect, test } from 'bun:test';
import {
	BEHAVIOR_SUPPORT_PRESETS,
	createBehaviorSignalModel,
	PREFERENCE_DIMENSION_PRESETS,
	resolveAdaptiveExperience,
	suggestAdaptiveExperienceEvolution,
} from './preference-dimensions';

const steadyMomentum = BEHAVIOR_SUPPORT_PRESETS.steadyMomentum;

describe('behavior signals and adaptive resolution', () => {
	test('rejects unsafe behavior labels in evidence', () => {
		expect(() =>
			createBehaviorSignalModel({
				id: 'unsafe-signal',
				kind: 'repeated_pattern',
				summary: 'User is lazy',
				evidence: {
					timeWindow: { start: '2026-04-01T00:00:00Z' },
					scope: { level: 'workflow', id: 'review' },
					confidence: 'medium',
					source: 'system-observation',
					safetyLevel: 'review',
					observations: ['Skipped a long reflection twice.'],
				},
			})
		).toThrow('unsafe labels');
	});

	test('resolves runtime actions without creating a stored profile', () => {
		const signal = createBehaviorSignalModel({
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

		const resolved = resolveAdaptiveExperience({
			preferences: PREFERENCE_DIMENSION_PRESETS.balanced,
			behaviorSupport: steadyMomentum,
			behaviorSignals: [signal],
			context: { workflowId: 'review' },
		});

		expect(resolved.persistence).toBe('runtime-only');
		expect(resolved.appliedAdaptations).toHaveLength(1);
		expect(resolved.appliedAdaptations[0]?.requiresConfirmation).toBe(false);
		expect(resolved.userFacingSummary).toContain('what changed');
	});

	test('suppresses runtime actions blocked by permissions', () => {
		const signal = createBehaviorSignalModel({
			id: 'signal-advanced-control',
			kind: 'repeated_pattern',
			summary: 'User often opens advanced controls.',
			evidence: {
				timeWindow: { start: '2026-04-01T00:00:00Z' },
				scope: { level: 'surface', id: 'settings' },
				confidence: 'high',
				source: 'system-observation',
				safetyLevel: 'review',
				observations: ['Opened advanced controls across three sessions.'],
				suggestedAdaptation: {
					id: 'advanced-controls',
					label: 'Show advanced controls',
					description: 'Offer advanced controls on this surface.',
					target: 'preference',
					dimension: 'control',
					value: 'advanced',
					scope: { level: 'surface', id: 'settings' },
					impact: 'high',
				},
			},
		});

		const resolved = resolveAdaptiveExperience({
			preferences: PREFERENCE_DIMENSION_PRESETS.balanced,
			behaviorSupport: steadyMomentum,
			behaviorSignals: [signal],
			permissions: [
				{
					key: 'advanced-controls',
					allowed: false,
					reason: 'Advanced controls are not permitted.',
				},
			],
		});

		expect(resolved.appliedAdaptations).toEqual([]);
		expect(resolved.suppressedAdaptations[0]?.suppressedReason).toBe(
			'Advanced controls are not permitted.'
		);
	});
});

describe('adaptive evolution suggestions', () => {
	test('suggests behavior support changes as scoped reversible suggestions', () => {
		const signal = createBehaviorSignalModel({
			id: 'signal-repair-first',
			kind: 'repeated_pattern',
			summary: 'User repeatedly chooses repair instead of reset.',
			evidence: {
				timeWindow: { start: '2026-04-01T00:00:00Z' },
				scope: { level: 'workflow', id: 'recovery' },
				confidence: 'high',
				source: 'system-observation',
				userFeedback: 'not-asked',
				safetyLevel: 'safe',
				observations: ['Chose repair after missed actions in three sessions.'],
				suggestedAdaptation: {
					id: 'repair-first',
					label: 'Suggest repair first',
					description: 'Suggest repair before reset after missed actions.',
					target: 'behaviorSupport',
					dimension: 'recovery',
					value: 'repair',
					scope: { level: 'workflow', id: 'recovery' },
					impact: 'low',
				},
			},
		});

		const result = suggestAdaptiveExperienceEvolution({
			currentPreferences: PREFERENCE_DIMENSION_PRESETS.balanced,
			currentBehaviorSupport: steadyMomentum,
			behaviorSignals: [signal],
		});

		expect(result.behaviorSupportSuggestions[0]).toMatchObject({
			dimension: 'recovery',
			from: 'resume',
			to: 'repair',
			scope: 'workflow',
			automatic: false,
			reversible: true,
		});
		expect(result.behaviorSupportSuggestions[0]?.reasons.join(' ')).toContain(
			'not a user identity'
		);
	});

	test('requires confirmation before increasing social exposure', () => {
		const signal = createBehaviorSignalModel({
			id: 'signal-peer-review',
			kind: 'user_feedback',
			summary: 'User asked to try shared review for this workflow.',
			evidence: {
				timeWindow: { start: '2026-04-01T00:00:00Z' },
				scope: { level: 'workflow', id: 'planning' },
				confidence: 'medium',
				source: 'explicit-feedback',
				safetyLevel: 'review',
				observations: ['Asked to try peer review on one workflow.'],
				suggestedAdaptation: {
					id: 'peer-review-support',
					label: 'Try peer review',
					description: 'Suggest peer review for this workflow.',
					target: 'behaviorSupport',
					dimension: 'accountability',
					value: 'peer-review',
					scope: { level: 'workflow', id: 'planning' },
					impact: 'medium',
				},
			},
		});

		const result = suggestAdaptiveExperienceEvolution({
			currentPreferences: PREFERENCE_DIMENSION_PRESETS.balanced,
			currentBehaviorSupport: steadyMomentum,
			behaviorSignals: [signal],
		});

		expect(result.behaviorSupportSuggestions[0]?.requiresConfirmation).toBe(
			true
		);
		expect(result.behaviorSupportSuggestions[0]?.reasons.join(' ')).toContain(
			'challenge, accountability, or social exposure require confirmation'
		);
	});
});
