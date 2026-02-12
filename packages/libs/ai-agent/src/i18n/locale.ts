/**
 * Locale resolution and configuration for the ai-agent i18n system.
 *
 * Locale priority: runtime override > spec-level > DEFAULT_LOCALE
 *
 * @module i18n/locale
 */

/** Default locale when none is specified */
export const DEFAULT_LOCALE = 'en';

/** Supported locales shipped with the ai-agent package */
export const SUPPORTED_LOCALES = ['en', 'fr', 'es'] as const;

/** Type for supported locales */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Resolve the effective locale from spec-level and runtime overrides.
 *
 * Priority (highest wins):
 *   1. runtimeLocale (from AgentCallOptions.locale)
 *   2. specLocale    (from AgentSpec.locale)
 *   3. DEFAULT_LOCALE ("en")
 *
 * If the resolved locale is not in SUPPORTED_LOCALES, falls back
 * to the base language (e.g., "fr-CA" -> "fr") or DEFAULT_LOCALE.
 *
 * @param specLocale    - Locale from the agent spec definition
 * @param runtimeLocale - Locale override passed at execution time
 * @returns The effective locale string
 */
export function resolveLocale(
  specLocale?: string,
  runtimeLocale?: string
): string {
  const raw = runtimeLocale ?? specLocale ?? DEFAULT_LOCALE;

  // Exact match
  if (isSupportedLocale(raw)) {
    return raw;
  }

  // Try base language (e.g., "fr-CA" -> "fr")
  const base = raw.split('-')[0];
  if (base && isSupportedLocale(base)) {
    return base;
  }

  return DEFAULT_LOCALE;
}

/**
 * Check if a locale string is one of the supported locales.
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}
