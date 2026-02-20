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

// Core i18n API
export {
  createContentGenI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
export type { ContentGenI18n } from './messages';

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
  BLOG_KEYS,
  EMAIL_KEYS,
  LANDING_KEYS,
  SOCIAL_KEYS,
  SEO_KEYS,
} from './keys';
export type { ContentGenMessageKey } from './keys';

// Catalogs
export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
