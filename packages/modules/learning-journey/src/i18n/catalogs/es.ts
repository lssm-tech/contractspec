/**
 * Spanish (es) translation catalog for @contractspec/module.learning-journey.
 *
 * @module i18n/catalogs/es
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const esMessages = defineTranslation({
  meta: {
    key: 'learning-journey.messages',
    version: '1.0.0',
    domain: 'learning-journey',
    description: 'XP source labels (Spanish)',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'es',
  fallback: 'en',
  messages: {
    'xp.source.base': {
      value: 'Base',
      description: 'XP breakdown label for base XP',
    },
    'xp.source.scoreBonus': {
      value: 'Bonificaci\u00f3n por puntuaci\u00f3n',
      description: 'XP breakdown label for score-based bonus',
    },
    'xp.source.perfectScore': {
      value: 'Puntuaci\u00f3n perfecta',
      description: 'XP breakdown label for perfect score bonus',
    },
    'xp.source.firstAttempt': {
      value: 'Primer intento',
      description: 'XP breakdown label for first attempt bonus',
    },
    'xp.source.retryPenalty': {
      value: 'Penalizaci\u00f3n por reintento',
      description: 'XP breakdown label for retry penalty',
    },
    'xp.source.streakBonus': {
      value: 'Bonificaci\u00f3n por racha',
      description: 'XP breakdown label for streak bonus',
    },
  },
});
