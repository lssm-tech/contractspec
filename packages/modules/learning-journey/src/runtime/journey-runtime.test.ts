import { describe, expect, it } from 'bun:test';
import type { JourneyTrackSpec } from '../track-spec';
import {
	createJourneyProgressState,
	projectJourneyProgress,
	recordJourneyEvent,
} from './progress-state';

const adaptiveTrack: JourneyTrackSpec = {
	id: 'adaptive_path',
	name: 'Adaptive Path',
	completionRewards: { badgeKey: 'adaptive_master', xp: 40 },
	steps: [
		{
			id: 'diagnostic',
			title: 'Run diagnostic',
			completion: { eventName: 'diagnostic.completed' },
			branches: [
				{
					key: 'advanced',
					when: {
						eventName: 'diagnostic.completed',
						payloadFilter: { placement: 'advanced' },
					},
					blockStepIds: ['remedial'],
				},
				{
					key: 'remedial',
					when: {
						eventName: 'diagnostic.completed',
						payloadFilter: { placement: 'remedial' },
					},
					blockStepIds: ['advanced'],
				},
			],
			xpReward: 10,
		},
		{
			id: 'remedial',
			title: 'Finish remedial lesson',
			completion: { eventName: 'lesson.remedial.completed' },
			prerequisites: [
				{
					kind: 'branch_selected',
					stepId: 'diagnostic',
					branchKey: 'remedial',
				},
			],
			xpReward: 15,
		},
		{
			id: 'advanced',
			title: 'Finish advanced lesson',
			completion: { eventName: 'lesson.advanced.completed' },
			prerequisites: [
				{
					kind: 'branch_selected',
					stepId: 'diagnostic',
					branchKey: 'advanced',
				},
			],
			xpReward: 20,
		},
	],
};

const practiceTrack: JourneyTrackSpec = {
	id: 'practice_loop',
	name: 'Practice Loop',
	completionRewards: { xp: 25 },
	steps: [
		{
			id: 'start',
			title: 'Start practice',
			completion: { eventName: 'practice.started' },
			xpReward: 5,
		},
		{
			id: 'high_accuracy',
			title: 'Stack three high-accuracy sessions',
			completion: {
				kind: 'count',
				atLeast: 3,
				eventName: 'session.completed',
				payloadFilter: { accuracyBucket: 'high' },
			},
			prerequisites: [{ kind: 'step_completed', stepId: 'start' }],
			xpReward: 10,
		},
		{
			id: 'mastery',
			title: 'Reach mastery twice',
			completion: {
				kind: 'mastery',
				eventName: 'card.mastered',
				minimumMastery: 0.8,
				requiredCount: 2,
			},
			prerequisites: [{ kind: 'step_completed', stepId: 'high_accuracy' }],
			xpReward: 15,
		},
	],
};

describe('journey runtime', () => {
	it('selects branches and blocks the non-selected path', () => {
		let state = createJourneyProgressState(adaptiveTrack);
		state = recordJourneyEvent(adaptiveTrack, state, {
			name: 'diagnostic.completed',
			payload: { placement: 'advanced' },
		});

		const snapshot = projectJourneyProgress(adaptiveTrack, state);
		const diagnostic = snapshot.steps.find(
			(step) => step.stepId === 'diagnostic'
		);
		const remedial = snapshot.steps.find((step) => step.stepId === 'remedial');

		expect(diagnostic?.selectedBranchKey).toBe('advanced');
		expect(remedial?.status).toBe('BLOCKED');
		expect(snapshot.currentStepId).toBe('advanced');
		expect(snapshot.availableStepIds).toEqual(['advanced']);
	});

	it('projects count and mastery progress from the canonical runtime', () => {
		let state = createJourneyProgressState(practiceTrack);
		state = recordJourneyEvent(practiceTrack, state, {
			name: 'practice.started',
		});
		state = recordJourneyEvent(practiceTrack, state, {
			name: 'session.completed',
			payload: { accuracyBucket: 'high' },
		});
		state = recordJourneyEvent(practiceTrack, state, {
			name: 'session.completed',
			payload: { accuracyBucket: 'high' },
		});
		state = recordJourneyEvent(practiceTrack, state, {
			name: 'session.completed',
			payload: { accuracyBucket: 'high' },
		});
		state = recordJourneyEvent(practiceTrack, state, {
			name: 'card.mastered',
			payload: { mastery: 0.9 },
		});
		state = recordJourneyEvent(practiceTrack, state, {
			name: 'card.mastered',
			payload: { mastery: 0.95 },
		});

		const snapshot = projectJourneyProgress(practiceTrack, state);
		expect(snapshot.isCompleted).toBeTrue();
		expect(snapshot.progressPercent).toBe(100);
		expect(snapshot.xpEarned).toBe(55);
	});

	it('marks overdue steps as missed while preserving completed work', () => {
		const startedAt = new Date('2026-01-01T08:00:00.000Z');
		const track: JourneyTrackSpec = {
			id: 'timed_track',
			name: 'Timed Track',
			steps: [
				{
					id: 'kickoff',
					title: 'Kickoff',
					completion: { eventName: 'kickoff.done' },
					xpReward: 5,
				},
				{
					id: 'timed',
					title: 'Timed follow-up',
					completion: { eventName: 'timed.done' },
					availability: { unlockAfterHours: 24, dueWithinHours: 24 },
					prerequisites: [{ kind: 'step_completed', stepId: 'kickoff' }],
					xpReward: 10,
				},
			],
		};

		let state = createJourneyProgressState(track, { now: startedAt });
		state = recordJourneyEvent(track, state, {
			name: 'kickoff.done',
			occurredAt: startedAt,
		});

		const snapshot = projectJourneyProgress(track, state, {
			now: new Date('2026-01-03T10:00:00.000Z'),
		});
		const timed = snapshot.steps.find((step) => step.stepId === 'timed');

		expect(timed?.status).toBe('MISSED');
		expect(snapshot.progressPercent).toBe(50);
		expect(snapshot.nextStepId).toBeNull();
	});
});
