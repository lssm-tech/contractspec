/**
 * French (fr) translation catalog for @contractspec/module.learning-journey.
 *
 * @module i18n/catalogs/fr
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const frMessages = defineTranslation({
  meta: {
    key: 'learning-journey.messages',
    version: '1.0.0',
    domain: 'learning-journey',
    description: 'XP source labels (French)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'fr',
  fallback: 'en',
  messages: {
    'xp.source.base': {
      value: 'Base',
      description: 'XP breakdown label for base XP',
    },
    'xp.source.scoreBonus': {
      value: 'Bonus de score',
      description: 'XP breakdown label for score-based bonus',
    },
    'xp.source.perfectScore': {
      value: 'Score parfait',
      description: 'XP breakdown label for perfect score bonus',
    },
    'xp.source.firstAttempt': {
      value: 'Premier essai',
      description: 'XP breakdown label for first attempt bonus',
    },
    'xp.source.retryPenalty': {
      value: 'P\u00e9nalit\u00e9 de r\u00e9essai',
      description: 'XP breakdown label for retry penalty',
    },
    'xp.source.streakBonus': {
      value: 'Bonus de s\u00e9rie',
      description: 'XP breakdown label for streak bonus',
    },
  },
});
