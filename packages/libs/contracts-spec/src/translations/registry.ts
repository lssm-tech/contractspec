/**
 * Translation registry for managing translation specs.
 *
 * Provides registration, lookup, and resolution of translation specs
 * with support for locale fallback chains.
 *
 * @module translations/registry
 *
 * @example
 * ```typescript
 * import { TranslationRegistry } from '@contractspec/lib.contracts-spec';
 *
 * const registry = new TranslationRegistry();
 *
 * // Register translations
 * registry.register(englishMessages);
 * registry.register(frenchMessages);
 *
 * // Get a translation spec
 * const spec = registry.get('auth.messages', '1.0.0', 'en');
 *
 * // Get a specific message
 * const message = registry.getMessage('auth.messages', 'login.success', 'en');
 *
 * // Get with fallback
 * const messageWithFallback = registry.getWithFallback(
 *   'auth.messages',
 *   'login.success',
 *   'de', // German
 *   'en'  // Fallback to English
 * );
 * ```
 */

import type {
  TranslationSpec,
  TranslationMessage,
  Locale,
  MessageKey,
} from './spec';

// ─────────────────────────────────────────────────────────────────────────────
// Registry Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TranslationLookupResult {
  spec: TranslationSpec;
  message: TranslationMessage;
  locale: Locale;
  fromFallback: boolean;
}

export interface TranslationRegistryStats {
  totalSpecs: number;
  locales: Locale[];
  domains: string[];
  totalMessages: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry Implementation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registry for translation specs with locale-aware lookup.
 */
export class TranslationRegistry {
  // Key format: `${key}:${version}:${locale}`
  private readonly specs = new Map<string, TranslationSpec>();
  // Index by key + locale (latest version): `${key}:${locale}`
  private readonly latestByLocale = new Map<string, TranslationSpec>();
  // All locales registered
  private readonly locales = new Set<Locale>();
  // All domains registered
  private readonly domains = new Set<string>();

  constructor(items?: TranslationSpec[]) {
    if (items) {
      for (const spec of items) {
        this.register(spec);
      }
    }
  }

  /**
   * Register a translation spec.
   *
   * @param spec - Translation spec to register
   */
  register(spec: TranslationSpec): void {
    const fullKey = this.makeKey(spec.meta.key, spec.meta.version, spec.locale);
    this.specs.set(fullKey, spec);

    // Update latest by locale index
    const localeKey = `${spec.meta.key}:${spec.locale}`;
    const existing = this.latestByLocale.get(localeKey);
    if (
      !existing ||
      this.isNewerVersion(spec.meta.version, existing.meta.version)
    ) {
      this.latestByLocale.set(localeKey, spec);
    }

    this.locales.add(spec.locale);
    this.domains.add(spec.meta.domain);
  }

  /**
   * Get a translation spec by key, version, and locale.
   *
   * @param key - Translation spec key
   * @param version - Version string
   * @param locale - Locale code
   * @returns Translation spec or undefined
   */
  get(
    key: string,
    version: string,
    locale: Locale
  ): TranslationSpec | undefined {
    return this.specs.get(this.makeKey(key, version, locale));
  }

  /**
   * Get the latest version of a translation spec for a locale.
   *
   * @param key - Translation spec key
   * @param locale - Locale code
   * @returns Translation spec or undefined
   */
  getLatest(key: string, locale: Locale): TranslationSpec | undefined {
    return this.latestByLocale.get(`${key}:${locale}`);
  }

  /**
   * Get a specific message from a translation spec.
   *
   * @param specKey - Translation spec key
   * @param messageKey - Message key within the spec
   * @param locale - Locale code
   * @param version - Optional version (uses latest if not specified)
   * @returns Translation message or undefined
   */
  getMessage(
    specKey: string,
    messageKey: MessageKey,
    locale: Locale,
    version?: string
  ): TranslationMessage | undefined {
    const spec = version
      ? this.get(specKey, version, locale)
      : this.getLatest(specKey, locale);

    if (!spec) return undefined;
    return spec.messages[messageKey];
  }

  /**
   * Get a message value with fallback chain support.
   *
   * @param specKey - Translation spec key
   * @param messageKey - Message key within the spec
   * @param locale - Primary locale
   * @param fallbackLocale - Fallback locale (optional, uses spec's fallback if not provided)
   * @param version - Optional version (uses latest if not specified)
   * @returns Translation lookup result or undefined
   */
  getWithFallback(
    specKey: string,
    messageKey: MessageKey,
    locale: Locale,
    fallbackLocale?: Locale,
    version?: string
  ): TranslationLookupResult | undefined {
    // Try primary locale first
    const spec = version
      ? this.get(specKey, version, locale)
      : this.getLatest(specKey, locale);

    if (spec) {
      const message = spec.messages[messageKey];
      if (message) {
        return { spec, message, locale, fromFallback: false };
      }

      // Use spec's fallback if no explicit fallback provided
      fallbackLocale = fallbackLocale ?? spec.fallback;
    }

    // Try fallback locale
    if (fallbackLocale && fallbackLocale !== locale) {
      const fallbackSpec = version
        ? this.get(specKey, version, fallbackLocale)
        : this.getLatest(specKey, fallbackLocale);

      if (fallbackSpec) {
        const message = fallbackSpec.messages[messageKey];
        if (message) {
          return {
            spec: fallbackSpec,
            message,
            locale: fallbackLocale,
            fromFallback: true,
          };
        }
      }
    }

    return undefined;
  }

  /**
   * Get a message value string with fallback.
   *
   * Convenience method that returns just the string value or a fallback.
   *
   * @param specKey - Translation spec key
   * @param messageKey - Message key
   * @param locale - Primary locale
   * @param fallback - String to return if message not found (default: messageKey)
   * @returns Message value or fallback
   */
  getValue(
    specKey: string,
    messageKey: MessageKey,
    locale: Locale,
    fallback?: string
  ): string {
    const result = this.getWithFallback(specKey, messageKey, locale);
    return result?.message.value ?? fallback ?? messageKey;
  }

  /**
   * List all locales available for a spec key.
   *
   * @param specKey - Translation spec key
   * @returns Array of available locales
   */
  listLocales(specKey: string): Locale[] {
    const locales: Locale[] = [];
    for (const [key, spec] of this.specs.entries()) {
      if (key.startsWith(`${specKey}:`)) {
        if (!locales.includes(spec.locale)) {
          locales.push(spec.locale);
        }
      }
    }
    return locales;
  }

  /**
   * List all translation specs.
   *
   * @returns Array of all registered translation specs
   */
  list(): TranslationSpec[] {
    return [...this.specs.values()];
  }

  /**
   * List translation specs by locale.
   *
   * @param locale - Locale to filter by
   * @returns Array of translation specs for the locale
   */
  listByLocale(locale: Locale): TranslationSpec[] {
    return [...this.specs.values()].filter((s) => s.locale === locale);
  }

  /**
   * List translation specs by domain.
   *
   * @param domain - Domain to filter by
   * @returns Array of translation specs for the domain
   */
  listByDomain(domain: string): TranslationSpec[] {
    return [...this.specs.values()].filter((s) => s.meta.domain === domain);
  }

  /**
   * Check if a translation spec exists.
   *
   * @param key - Translation spec key
   * @param locale - Locale code
   * @param version - Optional version
   * @returns True if spec exists
   */
  has(key: string, locale: Locale, version?: string): boolean {
    if (version) {
      return this.specs.has(this.makeKey(key, version, locale));
    }
    return this.latestByLocale.has(`${key}:${locale}`);
  }

  /**
   * Get all registered locales.
   *
   * @returns Set of all registered locales
   */
  getLocales(): ReadonlySet<Locale> {
    return this.locales;
  }

  /**
   * Get all registered domains.
   *
   * @returns Set of all registered domains
   */
  getDomains(): ReadonlySet<string> {
    return this.domains;
  }

  /**
   * Get registry statistics.
   *
   * @returns Registry statistics
   */
  getStats(): TranslationRegistryStats {
    let totalMessages = 0;
    for (const spec of this.specs.values()) {
      totalMessages += Object.keys(spec.messages).length;
    }

    return {
      totalSpecs: this.specs.size,
      locales: [...this.locales],
      domains: [...this.domains],
      totalMessages,
    };
  }

  /**
   * Clear all registered specs.
   */
  clear(): void {
    this.specs.clear();
    this.latestByLocale.clear();
    this.locales.clear();
    this.domains.clear();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────────────────────────────

  private makeKey(key: string, version: string, locale: Locale): string {
    return `${key}:${version}:${locale}`;
  }

  private isNewerVersion(a: string, b: string): boolean {
    // Simple semver comparison (major.minor.patch)
    const parseVersion = (v: string) => {
      const parts = v.split('.').map(Number);
      return {
        major: parts[0] ?? 0,
        minor: parts[1] ?? 0,
        patch: parts[2] ?? 0,
      };
    };

    const va = parseVersion(a);
    const vb = parseVersion(b);

    if (va.major !== vb.major) return va.major > vb.major;
    if (va.minor !== vb.minor) return va.minor > vb.minor;
    return va.patch > vb.patch;
  }
}
