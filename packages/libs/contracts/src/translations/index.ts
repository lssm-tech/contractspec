/**
 * Translation module for i18n contract system.
 *
 * Provides comprehensive types, registry, and validation for
 * translatable content with support for pluralization, ICU message
 * format, locale fallback, and context-aware translations.
 *
 * @module translations
 *
 * @example
 * ```typescript
 * import {
 *   defineTranslation,
 *   TranslationRegistry,
 *   validateTranslationSpec,
 * } from '@contractspec/lib.contracts';
 *
 * // Define a translation spec
 * const messages = defineTranslation({
 *   meta: {
 *     key: 'payments.messages',
 *     version: '1.0.0',
 *     domain: 'payments',
 *     owners: [{ team: 'payments' }],
 *   },
 *   locale: 'en',
 *   messages: {
 *     'payment.success': {
 *       value: 'Payment completed successfully',
 *       description: 'Shown after successful payment',
 *     },
 *   },
 * });
 *
 * // Register and lookup
 * const registry = new TranslationRegistry([messages]);
 * const msg = registry.getMessage('payments.messages', 'payment.success', 'en');
 * ```
 */

// Core types and factory
export * from './spec';

// Registry
export * from './registry';

// Validation
export * from './validation';

// Legacy catalog types (for backwards compatibility)
// Note: Locale and MessageKey are re-exported from spec.ts, not catalog.ts
export type {
  TranslationEntry,
  TranslationCatalogMeta,
  PlatformTranslationCatalog,
  BlueprintTranslationCatalog,
} from './catalog';

// Tenant overrides
export * from './tenant';
