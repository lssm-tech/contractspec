import type { LearningJourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';

export const drillsLanguageBasicsTrack: LearningJourneyTrackSpec = {
  id: 'drills_language_basics',
  name: 'Language Basics Drills',
  description:
    'Short SRS-driven drills to master a first skill, modeled after Duolingo-style sessions.',
  targetUserSegment: 'learner',
  targetRole: 'individual',
  totalXp: 50,
  completionRewards: { xpBonus: 25 },
  steps: [
    {
      id: 'complete_first_session',
      title: 'Complete first drill session',
      description: 'Finish a drill session to get started.',
      order: 1,
      completion: {
        kind: 'event',
        eventName: 'drill.session.completed',
      },
      xpReward: 20,
      metadata: { surface: 'drills' },
    },
    {
      id: 'reach_accuracy_threshold',
      title: 'Hit high accuracy in sessions',
      description: 'Achieve three high-accuracy sessions to build confidence.',
      order: 2,
      completion: {
        kind: 'count',
        eventName: 'drill.session.completed',
        atLeast: 3,
        payloadFilter: { accuracyBucket: 'high' },
      },
      xpReward: 30,
      metadata: { metric: 'accuracy', target: '>=85%' },
    },
    {
      id: 'unlock_new_skill',
      title: 'Master core cards in first skill',
      description:
        'Reach mastery on at least five cards in the first skill to unlock the next one.',
      order: 3,
      completion: {
        kind: 'srs_mastery',
        eventName: 'drill.card.mastered',
        minimumMastery: 0.8,
        requiredCount: 5,
        skillIdField: 'skillId',
        masteryField: 'mastery',
        payloadFilter: { skillId: 'language_basics' },
      },
      xpReward: 40,
      metadata: { surface: 'srs', skill: 'language_basics' },
    },
  ],
};

export const drillTracks: LearningJourneyTrackSpec[] = [
  drillsLanguageBasicsTrack,
];
