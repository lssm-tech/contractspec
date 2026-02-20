/**
 * Internationalization (i18n) module for @contractspec/lib.lifecycle.
 *
 * Provides multi-language support for:
 * - Lifecycle stage display names and questions
 * - Stage signals, traps, and focus areas
 * - Formatter strings (axis labels, stage titles, digests)
 *
 * @module i18n
 *
 * @example
 * ```ts
 * import { createLifecycleI18n } from '@contractspec/lib.lifecycle/i18n';
 *
 * const i18n = createLifecycleI18n("fr");
 * const name = i18n.t("stage.exploration.name");
 * // => "Exploration / Idéation"
 * ```
 */

// Core i18n API
export {
  createLifecycleI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
export type { LifecycleI18n } from './messages';

// Locale utilities
export {
  resolveLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from './locale';
export type { SupportedLocale } from './locale';

// Message keys
export {
  I18N_KEYS,
  STAGE_NAME_KEYS,
  STAGE_QUESTION_KEYS,
  STAGE_SIGNAL_KEYS,
  STAGE_TRAP_KEYS,
  STAGE_FOCUS_KEYS,
  FORMATTER_KEYS,
} from './keys';
export type { LifecycleMessageKey } from './keys';

// Catalogs
export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
