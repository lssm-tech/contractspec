import type { LearningJourneyTrackSpec } from '@lssm/module.learning-journey/track-spec';
import { LEARNING_EVENTS } from '../events';

export const drillsTrack: LearningJourneyTrackSpec = {
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
      xpReward: 10,
    },
    {
      id: 'hit_accuracy_threshold',
      title: 'Hit high accuracy 3 times',
      order: 2,
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
      completion: {
        kind: 'srs_mastery',
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

export const drillTracks: LearningJourneyTrackSpec[] = [drillsTrack];



