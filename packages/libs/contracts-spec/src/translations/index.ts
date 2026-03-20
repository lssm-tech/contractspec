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
 * } from '@contractspec/lib.contracts-spec';
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

// Legacy catalog types (for backwards compatibility)
// Note: Locale and MessageKey are re-exported from spec.ts, not catalog.ts
export type {
	BlueprintTranslationCatalog,
	PlatformTranslationCatalog,
	TranslationCatalogMeta,
	TranslationEntry,
} from './catalog';
// I18n factory for package-level message helpers
export * from './i18n-factory';
// Registry
export * from './registry';
// Core types and factory
export * from './spec';

// Tenant overrides
export * from './tenant';
// Validation
export * from './validation';
