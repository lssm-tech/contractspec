import { defineFeature } from '@contractspec/lib.contracts-spec';

export const LearningJourneyQuestChallengesFeature = defineFeature({
  meta: {
    key: 'learning-journey-quest-challenges',
    version: '1.0.0',
    title: 'Learning Journey: Quest Challenges',
    description:
      'Quest and challenge-based learning with deadlines and completion tracking',
    domain: 'learning-journey',
    owners: ['@examples'],
    tags: ['learning', 'quests', 'challenges', 'gamification'],
    stability: 'experimental',
  },

  docs: ['docs.learning-journey.quest-challenges'],
});
