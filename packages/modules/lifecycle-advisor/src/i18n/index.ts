/**
 * Internationalization (i18n) module for @contractspec/module.lifecycle-advisor.
 *
 * @module i18n
 */

export {
  createLifecycleAdvisorI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
export type { LifecycleAdvisorI18n } from './messages';

export {
  resolveLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from './locale';
export type { SupportedLocale } from './locale';

export {
  I18N_KEYS,
  FOCUS_KEYS,
  ACTION_KEYS,
  CEREMONY_KEYS,
  LIBRARY_KEYS,
  ENGINE_KEYS,
} from './keys';
export type { LifecycleAdvisorMessageKey } from './keys';

export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
