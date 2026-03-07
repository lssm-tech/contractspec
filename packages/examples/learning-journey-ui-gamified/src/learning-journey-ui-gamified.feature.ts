import { defineFeature } from '@contractspec/lib.contracts-spec';

export const LearningJourneyUiGamifiedFeature = defineFeature({
  meta: {
    key: 'learning-journey-ui-gamified',
    version: '1.0.0',
    title: 'Learning Journey UI: Gamified',
    description:
      'Gamified learning UI with drills, quests, flash cards, and mastery rings',
    domain: 'learning-journey',
    owners: ['@examples'],
    tags: ['learning', 'ui', 'gamified', 'drills'],
    stability: 'experimental',
  },

  docs: ['docs.examples.learning-journey-ui-gamified'],
});
