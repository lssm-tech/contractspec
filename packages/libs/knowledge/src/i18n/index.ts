/**
 * Internationalization (i18n) module for @contractspec/lib.knowledge.
 *
 * Provides multi-language support for all strings in the package:
 * - Access guard denial/warning messages
 * - LLM system prompts and query templates
 * - Gmail ingestion formatting labels
 *
 * @module i18n
 *
 * @example
 * ```ts
 * import { createKnowledgeI18n, I18N_KEYS } from '@contractspec/lib.knowledge/i18n';
 *
 * const i18n = createKnowledgeI18n("fr");
 * const msg = i18n.t("access.notBound", { spaceKey: "docs" });
 * ```
 */

// Core i18n API
export {
  createKnowledgeI18n,
  getDefaultI18n,
  resetI18nRegistry,
} from './messages';
export type { KnowledgeI18n } from './messages';

// Locale utilities
export {
  resolveLocale,
  isSupportedLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from './locale';
export type { SupportedLocale } from './locale';

// Message keys
export { I18N_KEYS, ACCESS_KEYS, QUERY_KEYS, INGESTION_KEYS } from './keys';
export type { KnowledgeMessageKey } from './keys';

// Catalogs
export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
