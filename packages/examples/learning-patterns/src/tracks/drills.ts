import type { JourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';
import { LEARNING_EVENTS } from '../events';

export const drillsTrack: JourneyTrackSpec = {
	id: 'learning_patterns_drills_basics',
	name: 'Drills Basics',
	description: 'Short drill sessions with an SRS-style mastery step.',
	targetUserSegment: 'learner',
	targetRole: 'individual',
	totalXp: 50,
	steps: [
		{
			id: 'complete_first_session',
			title: 'Complete your first session',
			order: 1,
			completion: {
				kind: 'event',
				eventName: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
			},
			branches: [
				{
					key: 'advanced',
					when: {
						kind: 'event',
						eventName: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
						payloadFilter: { accuracyBucket: 'high' },
					},
					blockStepIds: ['hit_accuracy_threshold'],
				},
				{
					key: 'guided',
					when: {
						kind: 'event',
						eventName: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
					},
				},
			],
			xpReward: 10,
		},
		{
			id: 'hit_accuracy_threshold',
			title: 'Hit high accuracy 3 times',
			order: 2,
			prerequisites: [
				{
					kind: 'branch_selected',
					stepId: 'complete_first_session',
					branchKey: 'guided',
				},
			],
			completion: {
				kind: 'count',
				eventName: LEARNING_EVENTS.DRILL_SESSION_COMPLETED,
				atLeast: 3,
				payloadFilter: { accuracyBucket: 'high' },
			},
			xpReward: 20,
		},
		{
			id: 'master_cards',
			title: 'Master 5 cards',
			order: 3,
			prerequisiteMode: 'any',
			prerequisites: [
				{ kind: 'step_completed', stepId: 'hit_accuracy_threshold' },
				{
					kind: 'branch_selected',
					stepId: 'complete_first_session',
					branchKey: 'advanced',
				},
			],
			completion: {
				kind: 'mastery',
				eventName: LEARNING_EVENTS.DRILL_CARD_MASTERED,
				minimumMastery: 0.8,
				requiredCount: 5,
				skillIdField: 'skillId',
				masteryField: 'mastery',
			},
			xpReward: 20,
		},
	],
};

export const drillTracks: JourneyTrackSpec[] = [drillsTrack];
