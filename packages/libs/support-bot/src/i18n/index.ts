/**
 * Internationalization (i18n) module for @contractspec/lib.support-bot.
 *
 * Provides multi-language support for all strings in the package:
 * - LLM system prompts and instructions
 * - Responder templates (greetings, closings, category intros)
 * - Resolver labels and escalation reasons
 * - Tool registration strings
 * - Error messages and feedback labels
 *
 * @module i18n
 *
 * @example
 * ```ts
 * import { createSupportBotI18n, I18N_KEYS } from '@contractspec/lib.support-bot/i18n';
 *
 * const i18n = createSupportBotI18n("fr");
 * const greeting = i18n.t("responder.greeting.anonymous");
 * // => "Bonjour,"
 * ```
 */

// Catalogs
export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { SupportBotMessageKey } from './keys';

// Message keys
export {
	ERROR_KEYS,
	FEEDBACK_KEYS,
	I18N_KEYS,
	PROMPT_KEYS,
	RESOLVER_KEYS,
	RESPONDER_KEYS,
	SPEC_KEYS,
	TOOL_KEYS,
} from './keys';
export type { SupportedLocale } from './locale';
// Locale utilities
export {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';
export type { SupportBotI18n } from './messages';
// Core i18n API
export {
	createSupportBotI18n,
	getDefaultI18n,
	interpolate,
	resetI18nRegistry,
} from './messages';
