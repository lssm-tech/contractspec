import { describe, expect, it } from 'bun:test';
import {
	createJourneyProgressState,
	projectJourneyProgress,
	recordJourneyEvent,
} from '@contractspec/module.learning-journey/runtime';
import { moneyResetQuestTrack } from './track';

describe('quest challenges track', () => {
	it('unlocks each day only after the previous quest step completes', () => {
		const start = new Date('2024-01-01T09:00:00.000Z');
		let state = createJourneyProgressState(moneyResetQuestTrack, {
			now: start,
		});

		state = recordJourneyEvent(moneyResetQuestTrack, state, {
			name: 'accounts.mapped',
			occurredAt: start,
		});
		const day1 = projectJourneyProgress(moneyResetQuestTrack, state, {
			now: start,
		});
		expect(day1.completedStepIds).toEqual(['day1_map_accounts']);
		expect(day1.currentStepId).toBeNull();

		const day2Time = new Date('2024-01-02T09:00:00.000Z');
		state = recordJourneyEvent(moneyResetQuestTrack, state, {
			name: 'transactions.categorized',
			occurredAt: day2Time,
		});
		const day2 = projectJourneyProgress(moneyResetQuestTrack, state, {
			now: day2Time,
		});

		expect(day2.completedStepIds).toEqual([
			'day1_map_accounts',
			'day2_categorize_transactions',
		]);
		expect(day2.currentStepId).toBeNull();
	});
});
