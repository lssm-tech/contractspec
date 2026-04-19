import { describe, expect, it } from 'bun:test';
import { SRSEngine } from '@contractspec/module.learning-journey/engines/srs';
import { StreakEngine } from '@contractspec/module.learning-journey/engines/streak';
import { XPEngine } from '@contractspec/module.learning-journey/engines/xp';
import {
	createJourneyProgressState,
	projectJourneyProgress,
	recordJourneyEvent,
} from '@contractspec/module.learning-journey/runtime';
import { LEARNING_EVENTS } from './events';
import { ambientCoachTrack } from './tracks/ambient-coach';
import { drillsTrack } from './tracks/drills';
import { questTrack } from './tracks/quests';

describe('@contractspec/example.learning-patterns tracks', () => {
	it('drills track progresses through the guided branch and mastery loop', () => {
		let state = createJourneyProgressState(drillsTrack);
		state = recordJourneyEvent(drillsTrack, state, {
			name: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
			payload: { accuracyBucket: 'medium' },
		});
		state = recordJourneyEvent(drillsTrack, state, {
			name: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
			payload: { accuracyBucket: 'high' },
		});
		state = recordJourneyEvent(drillsTrack, state, {
			name: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
			payload: { accuracyBucket: 'high' },
		});
		state = recordJourneyEvent(drillsTrack, state, {
			name: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
			payload: { accuracyBucket: 'high' },
		});

		for (let index = 0; index < 5; index++) {
			state = recordJourneyEvent(drillsTrack, state, {
				name: LEARNING_EVENTS.DRILL_CARD_MASTERED,
				payload: { skillId: 's1', mastery: 0.9 },
			});
		}

		const progress = projectJourneyProgress(drillsTrack, state);
		expect(progress.isCompleted).toBeTrue();
		expect(progress.progressPercent).toBe(100);
		expect(progress.completedStepIds).toEqual([
			'complete_first_session',
			'hit_accuracy_threshold',
			'master_cards',
		]);
	});

	it('ambient coach track progresses via shown -> acknowledged -> actionTaken', () => {
		let state = createJourneyProgressState(ambientCoachTrack);
		state = recordJourneyEvent(ambientCoachTrack, state, {
			name: LEARNING_EVENTS.COACH_TIP_SHOWN,
		});
		state = recordJourneyEvent(ambientCoachTrack, state, {
			name: LEARNING_EVENTS.COACH_TIP_ACKNOWLEDGED,
		});
		state = recordJourneyEvent(ambientCoachTrack, state, {
			name: LEARNING_EVENTS.COACH_TIP_ACTION_TAKEN,
		});

		expect(
			projectJourneyProgress(ambientCoachTrack, state).isCompleted
		).toBeTrue();
	});

	it('quest track respects unlockOnDay availability', () => {
		const start = new Date('2026-01-01T10:00:00.000Z');
		const day1 = new Date('2026-01-01T12:00:00.000Z');
		const day2 = new Date('2026-01-02T12:00:00.000Z');

		let state = createJourneyProgressState(questTrack, { now: start });
		state = recordJourneyEvent(questTrack, state, {
			name: LEARNING_EVENTS.QUEST_STARTED,
			occurredAt: start,
		});
		state = recordJourneyEvent(questTrack, state, {
			name: LEARNING_EVENTS.QUEST_STEP_COMPLETED,
			occurredAt: day1,
		});

		const day1Snapshot = projectJourneyProgress(questTrack, state, {
			now: day1,
		});
		expect(day1Snapshot.completedStepIds).toEqual([
			'day1_start',
			'day1_complete',
		]);
		expect(
			day1Snapshot.steps.find((step) => step.stepId === 'day2_complete')?.status
		).toBe('LOCKED');

		state = recordJourneyEvent(questTrack, state, {
			name: LEARNING_EVENTS.QUEST_STEP_COMPLETED,
			occurredAt: day2,
		});

		expect(
			projectJourneyProgress(questTrack, state, { now: day2 }).steps.find(
				(step) => step.stepId === 'day2_complete'
			)?.status
		).toBe('COMPLETED');
	});
});

describe('@contractspec/example.learning-patterns XP + streak + SRS determinism', () => {
	it('XP engine produces deterministic results for streak bonus inputs', () => {
		const xp = new XPEngine();
		const first = xp.calculate({
			activity: 'lesson_complete',
			score: 90,
			attemptNumber: 1,
			currentStreak: 7,
		});
		const second = xp.calculate({
			activity: 'lesson_complete',
			score: 90,
			attemptNumber: 1,
			currentStreak: 7,
		});
		expect(first.totalXp).toBe(second.totalXp);
		expect(first.totalXp).toBeGreaterThan(0);
	});

	it('streak engine increments on consecutive days deterministically', () => {
		const streak = new StreakEngine({ timezone: 'UTC' });
		const initial = {
			currentStreak: 0,
			longestStreak: 0,
			lastActivityAt: null,
			lastActivityDate: null,
			freezesRemaining: 0,
			freezeUsedAt: null,
		};
		const day1 = streak.update(
			initial,
			new Date('2026-01-01T10:00:00.000Z')
		).state;
		const day2 = streak.update(
			day1,
			new Date('2026-01-02T10:00:00.000Z')
		).state;
		expect(day2.currentStreak).toBe(2);
	});

	it('SRS engine nextReviewAt is deterministic for a fixed now + rating', () => {
		const srs = new SRSEngine();
		const now = new Date('2026-01-01T00:00:00.000Z');
		const state = {
			interval: 0,
			easeFactor: 2.5,
			repetitions: 0,
			learningStep: 0,
			isGraduated: false,
			isRelearning: false,
			lapses: 0,
		};
		expect(
			srs.calculateNextReview(state, 'GOOD', now).nextReviewAt.toISOString()
		).toBe('2026-01-01T00:10:00.000Z');
	});
});
