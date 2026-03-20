/**
 * Internationalization (i18n) module for @contractspec/module.lifecycle-advisor.
 *
 * @module i18n
 */

export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { LifecycleAdvisorMessageKey } from './keys';

export {
	ACTION_KEYS,
	CEREMONY_KEYS,
	ENGINE_KEYS,
	FOCUS_KEYS,
	I18N_KEYS,
	LIBRARY_KEYS,
} from './keys';
export type { SupportedLocale } from './locale';
export {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';
export type { LifecycleAdvisorI18n } from './messages';
export {
	createLifecycleAdvisorI18n,
	getDefaultI18n,
	resetI18nRegistry,
} from './messages';
