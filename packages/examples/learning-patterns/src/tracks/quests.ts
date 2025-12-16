import type { LearningJourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';
import { LEARNING_EVENTS } from '../events';

export const questTrack: LearningJourneyTrackSpec = {
  id: 'learning_patterns_quest_7day',
  name: 'Quest (7-day)',
  description: 'Time-bounded quest with day unlocks.',
  targetUserSegment: 'learner',
  targetRole: 'individual',
  totalXp: 70,
  steps: [
    {
      id: 'day1_start',
      title: 'Start the quest',
      order: 1,
      completion: { kind: 'event', eventName: LEARNING_EVENTS.QUEST_STARTED },
      xpReward: 10,
    },
    {
      id: 'day1_complete',
      title: 'Complete day 1 step',
      order: 2,
      completion: {
        kind: 'event',
        eventName: LEARNING_EVENTS.QUEST_STEP_COMPLETED,
      },
      availability: { unlockOnDay: 1, dueWithinHours: 48 },
      xpReward: 10,
    },
    {
      id: 'day2_complete',
      title: 'Complete day 2 step',
      order: 3,
      completion: {
        kind: 'event',
        eventName: LEARNING_EVENTS.QUEST_STEP_COMPLETED,
      },
      availability: { unlockOnDay: 2, dueWithinHours: 48 },
      xpReward: 10,
    },
  ],
};

export const questTracks: LearningJourneyTrackSpec[] = [questTrack];



