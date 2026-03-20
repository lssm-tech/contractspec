/**
 * Internationalization (i18n) module for @contractspec/lib.content-gen.
 *
 * Provides multi-language support for all strings in the package:
 * - LLM system prompts and instructions
 * - Deterministic content templates (blog, email, landing, social)
 * - SEO metadata strings
 * - Default CTAs and fallback copy
 *
 * @module i18n
 *
 * @example
 * ```ts
 * import { createContentGenI18n, I18N_KEYS } from '@contractspec/lib.content-gen/i18n';
 *
 * const i18n = createContentGenI18n("fr");
 * const heading = i18n.t("blog.heading.whyNow");
 * // => "Pourquoi maintenant"
 * ```
 */

// Catalogs
export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { ContentGenMessageKey } from './keys';

// Message keys
export {
	BLOG_KEYS,
	EMAIL_KEYS,
	I18N_KEYS,
	LANDING_KEYS,
	PROMPT_KEYS,
	SEO_KEYS,
	SOCIAL_KEYS,
} from './keys';
export type { SupportedLocale } from './locale';
// Locale utilities
export {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';
export type { ContentGenI18n } from './messages';
// Core i18n API
export {
	createContentGenI18n,
	getDefaultI18n,
	resetI18nRegistry,
} from './messages';
