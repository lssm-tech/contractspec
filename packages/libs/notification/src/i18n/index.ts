/**
 * Internationalization (i18n) module for @contractspec/lib.notification.
 *
 * @module i18n
 */

export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { NotificationsMessageKey } from './keys';

export { CHANNEL_KEYS, I18N_KEYS, TEMPLATE_KEYS } from './keys';
export type { SupportedLocale } from './locale';
export {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';
export type { NotificationsI18n } from './messages';
export {
	createNotificationsI18n,
	getDefaultI18n,
	resetI18nRegistry,
} from './messages';
