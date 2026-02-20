/**
 * Internationalization (i18n) module for @contractspec/module.learning-journey.
 *
 * @module i18n
 */

export {
  createLearningJourneyI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
export type { LearningJourneyI18n } from './messages';

export {
  resolveLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from './locale';
export type { SupportedLocale } from './locale';

export { I18N_KEYS, XP_SOURCE_KEYS } from './keys';
export type { LearningJourneyMessageKey } from './keys';

export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
