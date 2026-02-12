/**
 * Translation helper for the ai-agent package.
 *
 * Provides a lightweight `t()` function that resolves message keys
 * to translated strings using the TranslationRegistry from
 * @contractspec/lib.contracts.
 *
 * @module i18n/messages
 */

import { TranslationRegistry } from '@contractspec/lib.contracts/translations';
import { enMessages } from './catalogs/en';
import { frMessages } from './catalogs/fr';
import { esMessages } from './catalogs/es';
import { resolveLocale, DEFAULT_LOCALE } from './locale';
import type { AgentMessageKey } from './keys';

/** Spec key used to register all ai-agent translations */
const SPEC_KEY = 'ai-agent.messages';

/**
 * Interface for the agent i18n helper.
 */
export interface AgentI18n {
  /**
   * Translate a message key, with optional placeholder interpolation.
   *
   * @param key    - A key from I18N_KEYS
   * @param params - Optional placeholder values to interpolate
   * @returns The translated string (falls back to English, then to the key itself)
   *
   * @example
   * ```ts
   * const i18n = createAgentI18n("fr");
   * i18n.t("error.missingToolHandler", { name: "search" });
   * // => "Gestionnaire manquant pour l'outil : search"
   * ```
   */
  t(
    key: AgentMessageKey | string,
    params?: Record<string, string | number>
  ): string;

  /** The effective locale being used */
  readonly locale: string;
}

/**
 * Shared registry instance, lazily initialized.
 * All three catalogs (en, fr, es) are registered once.
 */
let sharedRegistry: TranslationRegistry | null = null;

function getRegistry(): TranslationRegistry {
  if (!sharedRegistry) {
    sharedRegistry = new TranslationRegistry([
      enMessages,
      frMessages,
      esMessages,
    ]);
  }
  return sharedRegistry;
}

/**
 * Simple ICU-like placeholder interpolation.
 *
 * Replaces `{key}` tokens in the string with values from the params map.
 * Does NOT handle full ICU message format (plurals, selects) -- only simple
 * string/number substitution, which is all the ai-agent strings require.
 *
 * @param template - The translated string with `{placeholder}` tokens
 * @param params   - Key-value map of placeholder replacements
 * @returns The interpolated string
 */
function interpolate(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key in params) {
      return String(params[key]);
    }
    return match; // leave unmatched placeholders as-is
  });
}

/**
 * Create an AgentI18n instance for a given locale.
 *
 * The locale is resolved through the standard priority chain:
 *   runtimeLocale > specLocale > DEFAULT_LOCALE ("en")
 *
 * @param specLocale    - Locale from the agent spec (optional)
 * @param runtimeLocale - Runtime locale override (optional)
 * @returns An AgentI18n instance bound to the resolved locale
 *
 * @example
 * ```ts
 * // Use spec locale
 * const i18n = createAgentI18n("fr");
 *
 * // Use runtime override
 * const i18n = createAgentI18n("fr", "es"); // resolves to "es"
 *
 * // Use default
 * const i18n = createAgentI18n(); // resolves to "en"
 * ```
 */
export function createAgentI18n(
  specLocale?: string,
  runtimeLocale?: string
): AgentI18n {
  const locale = resolveLocale(specLocale, runtimeLocale);
  const registry = getRegistry();

  return {
    locale,
    t(
      key: AgentMessageKey | string,
      params?: Record<string, string | number>
    ): string {
      const raw = registry.getValue(SPEC_KEY, key, locale, key);
      return interpolate(raw, params);
    },
  };
}

/**
 * Convenience: create a default (English) i18n instance.
 * Useful in contexts where no locale information is available.
 */
export function getDefaultI18n(): AgentI18n {
  return createAgentI18n(DEFAULT_LOCALE);
}

/**
 * Reset the shared registry (useful for testing).
 * @internal
 */
export function resetI18nRegistry(): void {
  sharedRegistry = null;
}
