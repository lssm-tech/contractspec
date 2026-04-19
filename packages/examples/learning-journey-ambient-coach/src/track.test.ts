import { describe, expect, it } from 'bun:test';
import {
	createJourneyProgressState,
	projectJourneyProgress,
	recordJourneyEvent,
} from '@contractspec/module.learning-journey/runtime';
import { moneyAmbientCoachTrack } from './track';

describe('ambient coach track', () => {
	it('completes sequential contextual tips through the canonical runtime', () => {
		const tipIds = [
			'cash_buffer_too_high',
			'no_savings_goal',
			'irregular_savings',
		];

		let state = createJourneyProgressState(moneyAmbientCoachTrack);
		for (const tipId of tipIds) {
			state = recordJourneyEvent(moneyAmbientCoachTrack, state, {
				name: 'coach.tip.follow_up_action_taken',
				payload: { tipId },
			});
		}

		expect(
			projectJourneyProgress(moneyAmbientCoachTrack, state).isCompleted
		).toBeTrue();
	});
});
