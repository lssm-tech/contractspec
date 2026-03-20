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

// Catalogs
export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { LifecycleMessageKey } from './keys';

// Message keys
export {
	FORMATTER_KEYS,
	I18N_KEYS,
	STAGE_FOCUS_KEYS,
	STAGE_NAME_KEYS,
	STAGE_QUESTION_KEYS,
	STAGE_SIGNAL_KEYS,
	STAGE_TRAP_KEYS,
} from './keys';
export type { SupportedLocale } from './locale';
// Locale utilities
export {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';
export type { LifecycleI18n } from './messages';
// Core i18n API
export {
	createLifecycleI18n,
	getDefaultI18n,
	resetI18nRegistry,
} from './messages';
