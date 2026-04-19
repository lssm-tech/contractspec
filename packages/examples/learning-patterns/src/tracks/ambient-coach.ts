import type { JourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';
import { LEARNING_EVENTS } from '../events';

export const ambientCoachTrack: JourneyTrackSpec = {
	id: 'learning_patterns_ambient_coach_basics',
	name: 'Ambient Coach Basics',
	description: 'Contextual tips triggered by behavior events.',
	targetUserSegment: 'learner',
	targetRole: 'individual',
	totalXp: 30,
	steps: [
		{
			id: 'tip_shown',
			title: 'See a contextual tip',
			order: 1,
			completion: { kind: 'event', eventName: LEARNING_EVENTS.COACH_TIP_SHOWN },
			xpReward: 10,
		},
		{
			id: 'tip_acknowledged',
			title: 'Acknowledge a tip',
			order: 2,
			prerequisites: [{ kind: 'step_completed', stepId: 'tip_shown' }],
			completion: {
				kind: 'event',
				eventName: LEARNING_EVENTS.COACH_TIP_ACKNOWLEDGED,
			},
			xpReward: 10,
		},
		{
			id: 'tip_action_taken',
			title: 'Take an action from a tip',
			order: 3,
			prerequisites: [{ kind: 'step_completed', stepId: 'tip_acknowledged' }],
			completion: {
				kind: 'event',
				eventName: LEARNING_EVENTS.COACH_TIP_ACTION_TAKEN,
			},
			xpReward: 10,
		},
	],
};

export const ambientCoachTracks: JourneyTrackSpec[] = [ambientCoachTrack];
