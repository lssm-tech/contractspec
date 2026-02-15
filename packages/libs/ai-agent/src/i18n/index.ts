/**
 * Internationalization (i18n) module for @contractspec/lib.ai-agent.
 *
 * Provides multi-language support for all strings in the package:
 * - LLM system prompts and instructions
 * - Tool descriptions and parameter labels
 * - Error messages
 * - Exported markdown and documentation
 * - Console/log messages
 *
 * @module i18n
 *
 * @example
 * ```ts
 * import { createAgentI18n, I18N_KEYS } from '@contractspec/lib.ai-agent/i18n';
 *
 * const i18n = createAgentI18n("fr");
 * const msg = i18n.t("error.missingToolHandler", { name: "search" });
 * ```
 */

// Core i18n API
export { createAgentI18n, getDefaultI18n, resetI18nRegistry } from './messages';
export type { AgentI18n } from './messages';

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
  AGENT_KEYS,
  KNOWLEDGE_KEYS,
  TOOL_KEYS,
  INTEROP_KEYS,
  ERROR_KEYS,
  EXPORT_KEYS,
  APPROVAL_KEYS,
  LOG_KEYS,
} from './keys';
export type { AgentMessageKey } from './keys';

// Catalogs
export { enMessages } from './catalogs/en';
export { frMessages } from './catalogs/fr';
export { esMessages } from './catalogs/es';
