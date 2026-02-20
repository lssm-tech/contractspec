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

// Core i18n API
export {
  createSupportBotI18n,
  getDefaultI18n,
  resetI18nRegistry,
  interpolate,
} from './messages';
export type { SupportBotI18n } from './messages';

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
  PROMPT_KEYS,
  RESPONDER_KEYS,
  RESOLVER_KEYS,
  TOOL_KEYS,
  ERROR_KEYS,
  FEEDBACK_KEYS,
  SPEC_KEYS,
} from './keys';
export type { SupportBotMessageKey } from './keys';

// Catalogs
export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
