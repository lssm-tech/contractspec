/**
 * Internationalization (i18n) module for @contractspec/module.notifications.
 *
 * @module i18n
 */

export {
  createNotificationsI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
export type { NotificationsI18n } from './messages';

export {
  resolveLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from './locale';
export type { SupportedLocale } from './locale';

export { I18N_KEYS, TEMPLATE_KEYS, CHANNEL_KEYS } from './keys';
export type { NotificationsMessageKey } from './keys';

export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
