/**
 * Internationalization (i18n) module for @contractspec/module.lifecycle-core.
 *
 * @module i18n
 */

// Core i18n API
export {
  createLifecycleCoreI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
export type { LifecycleCoreI18n } from './messages';

// Locale utilities
export {
  resolveLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from './locale';
export type { SupportedLocale } from './locale';

// Message keys
export { I18N_KEYS, MILESTONE_KEYS } from './keys';
export type { LifecycleCoreMessageKey } from './keys';

// Catalogs
export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
