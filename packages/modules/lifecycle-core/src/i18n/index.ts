/**
 * Internationalization (i18n) module for @contractspec/module.lifecycle-core.
 *
 * @module i18n
 */

// Catalogs
export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { LifecycleCoreMessageKey } from './keys';

// Message keys
export { I18N_KEYS, MILESTONE_KEYS } from './keys';
export type { SupportedLocale } from './locale';
// Locale utilities
export {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';
export type { LifecycleCoreI18n } from './messages';
// Core i18n API
export {
	createLifecycleCoreI18n,
	getDefaultI18n,
	resetI18nRegistry,
} from './messages';
