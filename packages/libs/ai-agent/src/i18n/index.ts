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

// Catalogs
export { enMessages } from './catalogs/en';
export { esMessages } from './catalogs/es';
export { frMessages } from './catalogs/fr';
export type { AgentMessageKey } from './keys';

// Message keys
export {
	AGENT_KEYS,
	APPROVAL_KEYS,
	ERROR_KEYS,
	EXPORT_KEYS,
	I18N_KEYS,
	INTEROP_KEYS,
	KNOWLEDGE_KEYS,
	LOG_KEYS,
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
export type { AgentI18n } from './messages';
// Core i18n API
export { createAgentI18n, getDefaultI18n, resetI18nRegistry } from './messages';
