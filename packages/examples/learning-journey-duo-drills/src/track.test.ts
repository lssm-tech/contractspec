import { describe, expect, it } from 'bun:test';
import {
	createJourneyProgressState,
	projectJourneyProgress,
	recordJourneyEvent,
} from '@contractspec/module.learning-journey/runtime';
import { drillsLanguageBasicsTrack } from './track';

describe('duo drills track', () => {
	it('supports both the fast-track branch and mastery completion', () => {
		let state = createJourneyProgressState(drillsLanguageBasicsTrack);
		state = recordJourneyEvent(drillsLanguageBasicsTrack, state, {
			name: 'drill.session.completed',
			payload: { accuracyBucket: 'high' },
		});

		const afterDiagnostic = projectJourneyProgress(
			drillsLanguageBasicsTrack,
			state
		);
		expect(afterDiagnostic.blockedStepIds).toEqual([
			'reach_accuracy_threshold',
		]);
		expect(afterDiagnostic.currentStepId).toBe('unlock_new_skill');

		for (let index = 0; index < 5; index++) {
			state = recordJourneyEvent(drillsLanguageBasicsTrack, state, {
				name: 'drill.card.mastered',
				payload: { skillId: 'language_basics', mastery: 0.9 },
			});
		}

		expect(
			projectJourneyProgress(drillsLanguageBasicsTrack, state).isCompleted
		).toBeTrue();
	});
});
