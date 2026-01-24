/**
 * Translation specification types for i18n contract system.
 *
 * Provides comprehensive types for defining translatable content
 * with support for pluralization, ICU message format hints,
 * locale fallback, and context-aware translations.
 *
 * @module translations/spec
 *
 * @example
 * ```typescript
 * import { defineTranslation, TranslationSpec } from '@contractspec/lib.contracts';
 *
 * const messages = defineTranslation({
 *   meta: {
 *     key: 'payments.messages',
 *     version: '1.0.0',
 *     domain: 'payments',
 *     owners: [{ team: 'payments' }],
 *   },
 *   locale: 'en',
 *   fallback: 'en',
 *   messages: {
 *     'payment.success': {
 *       value: 'Payment of {amount, number, currency} completed successfully',
 *       description: 'Shown after successful payment',
 *       placeholders: [{ name: 'amount', type: 'number', format: 'currency' }],
 *     },
 *   },
 * });
 * ```
 */

import type { Owner, Stability, Tag } from '../ownership';

// ─────────────────────────────────────────────────────────────────────────────
// Core Types
// ─────────────────────────────────────────────────────────────────────────────

/** ISO 639-1 locale code (e.g., 'en', 'fr', 'de'). */
export type Locale = string;

/** Message key identifier. */
export type MessageKey = string;

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder Types
// ─────────────────────────────────────────────────────────────────────────────

export type PlaceholderType =
  | 'string'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime'
  | 'currency'
  | 'percent'
  | 'plural'
  | 'select'
  | 'selectordinal';

export interface PlaceholderDef {
  /** Placeholder name (without braces). */
  name: string;
  /** Type of the placeholder value. */
  type: PlaceholderType;
  /** Format specifier (e.g., 'short', 'long', 'currency'). */
  format?: string;
  /** Description for translators. */
  description?: string;
  /** Example value for context. */
  example?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Plural Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CLDR plural categories.
 * @see https://cldr.unicode.org/index/cldr-spec/plural-rules
 */
export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export interface PluralRule {
  category: PluralCategory;
  value: string;
}

export interface PluralRuleSet {
  /** Name of the plural variable. */
  variable: string;
  /** Rules for each plural category. */
  rules: PluralRule[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Message Variant Types
// ─────────────────────────────────────────────────────────────────────────────

export type VariantType = 'gender' | 'formality' | 'context';

export interface MessageVariant {
  /** Type of variant (gender, formality, context). */
  type: VariantType;
  /** Variant key (e.g., 'male', 'female', 'formal', 'informal'). */
  key: string;
  /** Variant value (the translated message for this variant). */
  value: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Translation Message Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TranslationMessage {
  /** The translated value (may use ICU message format). */
  value: string;
  /** Description for translators explaining context and usage. */
  description?: string;
  /** Usage context to help translators understand where this appears. */
  context?: string;
  /** Placeholder definitions for dynamic values. */
  placeholders?: PlaceholderDef[];
  /** Variants for gender, formality, or other contextual differences. */
  variants?: MessageVariant[];
  /** Maximum character length (hint for UI constraints). */
  maxLength?: number;
  /** Tags for categorization and filtering. */
  tags?: string[];
}

export type TranslationMessages = Record<MessageKey, TranslationMessage>;

// ─────────────────────────────────────────────────────────────────────────────
// Translation Spec Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TranslationMeta {
  /** Unique key for this translation spec. */
  key: string;
  /** Semantic version (e.g., "1.0.0"). */
  version: string;
  /** Business domain this translation belongs to. */
  domain: string;
  /** Description of the translation bundle. */
  description?: string;
  /** Owners responsible for this translation spec. */
  owners: Owner[];
  /** Stability marker. */
  stability?: Stability;
  /** Tags for categorization. */
  tags?: Tag[];
}

export interface TranslationSpec {
  /** Metadata about this translation spec. */
  meta: TranslationMeta;
  /** Primary locale for this translation spec. */
  locale: Locale;
  /** Fallback locale when a message is missing. */
  fallback?: Locale;
  /** Translation messages keyed by message key. */
  messages: TranslationMessages;
  /** Plural rules for the locale. */
  pluralRules?: PluralRuleSet[];
  /** Tags for categorization. */
  tags?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Reference Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TranslationRef {
  key: string;
  version: string;
  locale?: Locale;
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helper to define a Translation spec.
 *
 * @param spec - Translation specification
 * @returns The same spec with type inference
 *
 * @example
 * ```typescript
 * const messages = defineTranslation({
 *   meta: {
 *     key: 'auth.messages',
 *     version: '1.0.0',
 *     domain: 'auth',
 *     owners: [{ team: 'platform' }],
 *   },
 *   locale: 'en',
 *   messages: {
 *     'login.success': {
 *       value: 'Welcome back, {name}!',
 *       description: 'Shown after successful login',
 *       placeholders: [{ name: 'name', type: 'string' }],
 *     },
 *   },
 * });
 * ```
 */
export const defineTranslation = (spec: TranslationSpec): TranslationSpec =>
  spec;
