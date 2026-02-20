/**
 * English (en) translation catalog for @contractspec/module.learning-journey.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'learning-journey.messages',
    version: '1.0.0',
    domain: 'learning-journey',
    description: 'XP source labels for the learning-journey module',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    'xp.source.base': {
      value: 'Base',
      description: 'XP breakdown label for base XP',
    },
    'xp.source.scoreBonus': {
      value: 'Score Bonus',
      description: 'XP breakdown label for score-based bonus',
    },
    'xp.source.perfectScore': {
      value: 'Perfect Score',
      description: 'XP breakdown label for perfect score bonus',
    },
    'xp.source.firstAttempt': {
      value: 'First Attempt',
      description: 'XP breakdown label for first attempt bonus',
    },
    'xp.source.retryPenalty': {
      value: 'Retry Penalty',
      description: 'XP breakdown label for retry penalty',
    },
    'xp.source.streakBonus': {
      value: 'Streak Bonus',
      description: 'XP breakdown label for streak bonus',
    },
  },
});
