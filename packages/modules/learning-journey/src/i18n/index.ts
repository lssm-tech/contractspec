/**
 * Internationalization (i18n) module for @contractspec/module.learning-journey.
 *
 * @module i18n
 */

export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { LearningJourneyMessageKey } from './keys';

export { I18N_KEYS, XP_SOURCE_KEYS } from './keys';
export type { SupportedLocale } from './locale';
export {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';
export type { LearningJourneyI18n } from './messages';
export {
	createLearningJourneyI18n,
	getDefaultI18n,
	resetI18nRegistry,
} from './messages';
