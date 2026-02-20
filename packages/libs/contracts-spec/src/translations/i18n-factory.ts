/**
 * Generic i18n factory for ContractSpec packages.
 *
 * Eliminates the boilerplate duplicated across package-level
 * i18n/messages.ts files by extracting the common interpolation,
 * registry management, locale resolution, and t() wiring.
 *
 * @module translations/i18n-factory
 */

import { TranslationRegistry } from './registry';
import type { TranslationSpec } from './spec';

// ─────────────────────────────────────────────────────────────────────────────
// Shared Locale Resolution
// ─────────────────────────────────────────────────────────────────────────────

/** Default locale when none is specified. */
export const DEFAULT_LOCALE = 'en';

/** Supported locales shipped with ContractSpec packages. */
export const SUPPORTED_LOCALES = ['en', 'fr', 'es'] as const;

/** A locale included in the default set. */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Resolve the effective locale from two optional overrides.
 *
 * Priority: `runtimeLocale > optionsLocale > DEFAULT_LOCALE`.
 * Falls back to base language (e.g., `"fr-CA"` -> `"fr"`) when needed.
 */
export function resolveLocale(
  optionsLocale?: string,
  runtimeLocale?: string
): string {
  const raw = runtimeLocale ?? optionsLocale ?? DEFAULT_LOCALE;
  if (isSupportedLocale(raw)) return raw;
  const base = raw.split('-')[0];
  if (base && isSupportedLocale(base)) return base;
  return DEFAULT_LOCALE;
}

/** Check whether a string is a supported locale. */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared Interpolation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simple placeholder interpolation.
 *
 * Replaces `{key}` tokens with values from the params map.
 * Does NOT handle full ICU (plurals, selects) — only simple
 * string/number substitution.
 */
export function interpolate(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key in params) return String(params[key]);
    return match;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic I18n Instance
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A package-scoped i18n instance.
 *
 * @typeParam K - Union type of valid message keys for the package
 */
export interface I18nInstance<K extends string = string> {
  /** Translate a message key with optional placeholder interpolation. */
  t(key: K | string, params?: Record<string, string | number>): string;
  /** The effective locale being used. */
  readonly locale: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Types
// ─────────────────────────────────────────────────────────────────────────────

/** Configuration for `createI18nFactory`. */
export interface I18nFactoryConfig {
  /** The spec key used to register translations (e.g., `"ai-agent.messages"`). */
  specKey: string;
  /** Translation catalogs to register (typically `[en, fr, es]`). */
  catalogs: TranslationSpec[];
}

/** The object returned by `createI18nFactory`. */
export interface I18nFactory<K extends string = string> {
  /** Create an i18n instance for a given locale. */
  create(optionsLocale?: string, runtimeLocale?: string): I18nInstance<K>;
  /** Create a default (English) i18n instance. */
  getDefault(): I18nInstance<K>;
  /** Reset the shared registry (useful for testing). */
  resetRegistry(): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a package-scoped i18n factory.
 *
 * Replaces the ~100 lines of boilerplate previously duplicated
 * in every package's `i18n/messages.ts`.
 *
 * @typeParam K - The package's message key union type
 * @param config - Spec key and translation catalogs
 * @returns An I18nFactory with `create()`, `getDefault()`, and `resetRegistry()`
 *
 * @example
 * ```ts
 * import { createI18nFactory } from '@contractspec/lib.contracts-spec/translations';
 * import type { AgentMessageKey } from './keys';
 * import { enMessages } from './catalogs/en';
 * import { frMessages } from './catalogs/fr';
 * import { esMessages } from './catalogs/es';
 *
 * const factory = createI18nFactory<AgentMessageKey>({
 *   specKey: 'ai-agent.messages',
 *   catalogs: [enMessages, frMessages, esMessages],
 * });
 *
 * export type AgentI18n = I18nInstance<AgentMessageKey>;
 * export const createAgentI18n = factory.create;
 * export const getDefaultI18n = factory.getDefault;
 * export const resetI18nRegistry = factory.resetRegistry;
 * ```
 */
export function createI18nFactory<K extends string = string>(
  config: I18nFactoryConfig
): I18nFactory<K> {
  let sharedRegistry: TranslationRegistry | null = null;

  function getRegistry(): TranslationRegistry {
    if (!sharedRegistry) {
      sharedRegistry = new TranslationRegistry(config.catalogs);
    }
    return sharedRegistry;
  }

  const factory: I18nFactory<K> = {
    create(optionsLocale?: string, runtimeLocale?: string): I18nInstance<K> {
      const locale = resolveLocale(optionsLocale, runtimeLocale);
      const registry = getRegistry();

      return {
        locale,
        t(key: K | string, params?: Record<string, string | number>): string {
          const raw = registry.getValue(config.specKey, key, locale, key);
          return interpolate(raw, params);
        },
      };
    },

    getDefault(): I18nInstance<K> {
      return factory.create(DEFAULT_LOCALE);
    },

    resetRegistry(): void {
      sharedRegistry = null;
    },
  };

  return factory;
}
