/**
 * Translation validation utilities.
 *
 * Provides functions to validate translation specs, check for
 * missing translations, and validate ICU message format.
 *
 * @module translations/validation
 *
 * @example
 * ```typescript
 * import {
 *   validateTranslationSpec,
 *   findMissingTranslations,
 *   validateICUFormat
 * } from '@contractspec/lib.contracts-spec';
 *
 * // Validate a translation spec
 * const result = validateTranslationSpec(myTranslation);
 *
 * // Find missing translations between locales
 * const missing = findMissingTranslations(englishSpec, frenchSpec);
 *
 * // Validate ICU message format
 * const icuResult = validateICUFormat('{count, plural, one {item} other {items}}');
 * ```
 */

import {
	type MessageFormatElement,
	parse,
	TYPE,
} from '@formatjs/icu-messageformat-parser';
import type { TranslationRegistry } from './registry';
import type {
	Locale,
	MessageKey,
	TranslationMessage,
	TranslationSpec,
} from './spec';

// ─────────────────────────────────────────────────────────────────────────────
// Validation Types
// ─────────────────────────────────────────────────────────────────────────────

export type TranslationValidationLevel = 'error' | 'warning' | 'info';

export interface TranslationValidationIssue {
	level: TranslationValidationLevel;
	message: string;
	path?: string;
	context?: Record<string, unknown>;
}

export interface TranslationValidationResult {
	valid: boolean;
	issues: TranslationValidationIssue[];
}

export interface ICUValidationResult {
	valid: boolean;
	error?: string;
	placeholders: string[];
	plurals: string[];
	selects: string[];
	selectOrdinals: string[];
}

export interface MissingTranslation {
	messageKey: MessageKey;
	sourceLocale: Locale;
	targetLocale: Locale;
	sourceMessage: TranslationMessage;
}

// ─────────────────────────────────────────────────────────────────────────────
// Spec Validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate a translation spec for internal consistency.
 *
 * @param spec - Translation spec to validate
 * @returns Validation result with any issues found
 */
export function validateTranslationSpec(
	spec: TranslationSpec
): TranslationValidationResult {
	const issues: TranslationValidationIssue[] = [];

	// Validate meta
	validateMeta(spec, issues);

	// Validate locale
	validateLocale(spec, issues);

	// Validate messages
	validateMessages(spec, issues);

	// Validate plural rules
	validatePluralRules(spec, issues);

	return {
		valid: issues.filter((i) => i.level === 'error').length === 0,
		issues,
	};
}

function validateMeta(
	spec: TranslationSpec,
	issues: TranslationValidationIssue[]
): void {
	const { meta } = spec;

	if (!meta.key?.trim()) {
		issues.push({
			level: 'error',
			message: 'Translation spec must have a non-empty key',
			path: 'meta.key',
		});
	}

	if (!meta.version?.trim()) {
		issues.push({
			level: 'error',
			message: 'Translation spec must have a non-empty version',
			path: 'meta.version',
		});
	}

	if (!meta.domain?.trim()) {
		issues.push({
			level: 'error',
			message: 'Translation spec must have a non-empty domain',
			path: 'meta.domain',
		});
	}

	if (!meta.owners?.length) {
		issues.push({
			level: 'warning',
			message: 'Translation spec should specify owners',
			path: 'meta.owners',
		});
	}
}

function validateLocale(
	spec: TranslationSpec,
	issues: TranslationValidationIssue[]
): void {
	if (!spec.locale?.trim()) {
		issues.push({
			level: 'error',
			message: 'Translation spec must specify a locale',
			path: 'locale',
		});
	} else {
		validateLocaleTag(spec.locale, 'locale', issues);
	}

	if (spec.fallback) {
		validateLocaleTag(spec.fallback, 'fallback', issues);
	}

	if (spec.fallback === spec.locale) {
		issues.push({
			level: 'warning',
			message: 'Fallback locale is the same as primary locale',
			path: 'fallback',
		});
	}

	for (const [index, fallback] of (spec.fallbacks ?? []).entries()) {
		validateLocaleTag(fallback, `fallbacks[${index}]`, issues);
	}

	if (spec.defaultLocale) {
		validateLocaleTag(spec.defaultLocale, 'defaultLocale', issues);
	}

	for (const [index, locale] of (spec.supportedLocales ?? []).entries()) {
		validateLocaleTag(locale, `supportedLocales[${index}]`, issues);
	}

	validateLocaleKeySeparation(spec, issues);
}

function validateMessages(
	spec: TranslationSpec,
	issues: TranslationValidationIssue[]
): void {
	const { messages } = spec;

	if (!messages || Object.keys(messages).length === 0) {
		issues.push({
			level: 'warning',
			message: 'Translation spec has no messages',
			path: 'messages',
		});
		return;
	}

	for (const [key, message] of Object.entries(messages)) {
		const path = `messages.${key}`;

		// Validate message value
		if (!message.value?.trim()) {
			issues.push({
				level: 'error',
				message: `Message "${key}" has an empty value`,
				path: `${path}.value`,
			});
		}

		// Validate placeholders match value
		const icuResult = validateICUFormat(message.value);
		const valueParams = icuResult.placeholders;
		const declaredPlaceholders = message.placeholders ?? [];

		// Check for declared but unused placeholders
		for (const placeholder of declaredPlaceholders) {
			if (!valueParams.includes(placeholder.name)) {
				issues.push({
					level: 'warning',
					message: `Placeholder "${placeholder.name}" is defined but not used in message "${key}"`,
					path: `${path}.placeholders`,
				});
			}
		}

		// Check for undeclared placeholders (only if placeholders array exists)
		if (message.placeholders !== undefined) {
			for (const param of valueParams) {
				const declared = declaredPlaceholders.find((p) => p.name === param);
				if (!declared) {
					issues.push({
						level: 'info',
						message: `Placeholder "{${param}}" used in message "${key}" but not declared`,
						path: `${path}.placeholders`,
					});
				}
			}
		}

		if (!icuResult.valid) {
			issues.push({
				level: 'error',
				message: `Message "${key}" has invalid ICU format: ${icuResult.error}`,
				path: `${path}.value`,
			});
		}

		// Validate variants
		if (message.variants?.length) {
			const seenVariants = new Set<string>();
			for (const variant of message.variants) {
				const variantKey = `${variant.type}:${variant.key}`;
				if (seenVariants.has(variantKey)) {
					issues.push({
						level: 'warning',
						message: `Duplicate variant "${variantKey}" in message "${key}"`,
						path: `${path}.variants`,
					});
				}
				seenVariants.add(variantKey);

				if (!variant.value?.trim()) {
					issues.push({
						level: 'error',
						message: `Variant "${variantKey}" has an empty value in message "${key}"`,
						path: `${path}.variants`,
					});
				}
			}
		}

		// Validate max length
		if (message.maxLength !== undefined) {
			if (message.maxLength <= 0) {
				issues.push({
					level: 'error',
					message: `Message "${key}" has invalid maxLength (must be positive)`,
					path: `${path}.maxLength`,
				});
			} else if (message.value.length > message.maxLength) {
				issues.push({
					level: 'warning',
					message: `Message "${key}" value exceeds maxLength (${message.value.length} > ${message.maxLength})`,
					path: `${path}.value`,
				});
			}
		}
	}
}

function validatePluralRules(
	spec: TranslationSpec,
	issues: TranslationValidationIssue[]
): void {
	if (!spec.pluralRules?.length) return;

	for (let i = 0; i < spec.pluralRules.length; i++) {
		const rule = spec.pluralRules[i];
		if (!rule) continue;

		const path = `pluralRules[${i}]`;

		if (!rule.variable?.trim()) {
			issues.push({
				level: 'error',
				message: 'Plural rule must specify a variable name',
				path: `${path}.variable`,
			});
		}

		if (!rule.rules?.length) {
			issues.push({
				level: 'error',
				message: 'Plural rule must have at least one category',
				path: `${path}.rules`,
			});
		} else {
			// Must have 'other' category
			const hasOther = rule.rules.some((r) => r.category === 'other');
			if (!hasOther) {
				issues.push({
					level: 'error',
					message: `Plural rule "${rule.variable}" must have an "other" category`,
					path: `${path}.rules`,
				});
			}
		}
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// ICU Message Format Validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate ICU message format syntax.
 *
 * Uses FormatJS' ICU parser as the syntax source of truth, then extracts
 * ContractSpec metadata from the parser AST.
 *
 * @param message - Message string to validate
 * @returns Validation result with extracted components
 */
export function validateICUFormat(message: string): ICUValidationResult {
	const unmatchedClosingBrace = findUnmatchedClosingBrace(message);
	if (unmatchedClosingBrace) {
		return invalidICU(unmatchedClosingBrace);
	}

	try {
		return collectICUMetadata(
			parse(message, {
				ignoreTag: true,
				requiresOtherClause: true,
				shouldParseSkeletons: true,
			})
		);
	} catch (error) {
		return invalidICU(error instanceof Error ? error.message : 'Unknown error');
	}
}

function collectICUMetadata(ast: MessageFormatElement[]): ICUValidationResult {
	const placeholders = new Set<string>();
	const plurals = new Set<string>();
	const selects = new Set<string>();
	const selectOrdinals = new Set<string>();

	const visit = (elements: MessageFormatElement[]) => {
		for (const element of elements) {
			if ('value' in element && isValueArgument(element.type)) {
				placeholders.add(element.value);
			}
			if ('value' in element && element.type === TYPE.select) {
				selects.add(element.value);
			}
			if ('value' in element && element.type === TYPE.plural) {
				placeholders.add(element.value);
				if (element.pluralType === 'ordinal') {
					selectOrdinals.add(element.value);
				} else {
					plurals.add(element.value);
				}
			}
			if ('options' in element) {
				for (const option of Object.values(element.options)) {
					visit(option.value);
				}
			}
		}
	};

	visit(ast);
	return {
		valid: true,
		placeholders: [...placeholders],
		plurals: [...plurals],
		selects: [...selects],
		selectOrdinals: [...selectOrdinals],
	};
}

function isValueArgument(type: number): boolean {
	return (
		type === TYPE.argument ||
		type === TYPE.number ||
		type === TYPE.date ||
		type === TYPE.time ||
		type === TYPE.select ||
		type === TYPE.plural
	);
}

function invalidICU(error: string): ICUValidationResult {
	return {
		valid: false,
		error: friendlyICUError(error),
		placeholders: [],
		plurals: [],
		selects: [],
		selectOrdinals: [],
	};
}

function friendlyICUError(error: string): string {
	if (error.includes('EXPECT_ARGUMENT_CLOSING_BRACE')) {
		return 'Unbalanced opening brace';
	}
	if (error.includes('MISSING_OTHER_CLAUSE')) {
		return 'Plural/select/selectordinal messages must include an "other" branch';
	}
	return error;
}

function findUnmatchedClosingBrace(message: string): string | undefined {
	let depth = 0;
	for (let index = 0; index < message.length; index++) {
		const char = message[index];
		const previous = index > 0 ? message[index - 1] : '';
		if (previous === "'") continue;
		if (char === '{') depth++;
		if (char === '}') {
			depth--;
			if (depth < 0) return 'Unbalanced closing brace';
		}
	}
	return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Missing Translations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Find messages that exist in source but not in target.
 *
 * @param sourceSpec - Source translation spec (usually base locale like 'en')
 * @param targetSpec - Target translation spec to check
 * @returns Array of missing translations
 */
export function findMissingTranslations(
	sourceSpec: TranslationSpec,
	targetSpec: TranslationSpec
): MissingTranslation[] {
	const missing: MissingTranslation[] = [];

	for (const [key, message] of Object.entries(sourceSpec.messages)) {
		if (!targetSpec.messages[key]) {
			missing.push({
				messageKey: key,
				sourceLocale: sourceSpec.locale,
				targetLocale: targetSpec.locale,
				sourceMessage: message,
			});
		}
	}

	return missing;
}

/**
 * Find all missing translations across a registry.
 *
 * Compares each locale against a base locale to find missing keys.
 *
 * @param registry - Translation registry
 * @param specKey - Translation spec key to check
 * @param baseLocale - Base locale to compare against
 * @returns Map of locale to missing translations
 */
export function findAllMissingTranslations(
	registry: TranslationRegistry,
	specKey: string,
	baseLocale: Locale
): Map<Locale, MissingTranslation[]> {
	const result = new Map<Locale, MissingTranslation[]>();
	const baseSpec = registry.getLatest(specKey, baseLocale);

	if (!baseSpec) return result;

	const locales = registry.listLocales(specKey);
	for (const locale of locales) {
		if (locale === baseLocale) continue;

		const targetSpec = registry.getLatest(specKey, locale);
		if (targetSpec) {
			const missing = findMissingTranslations(baseSpec, targetSpec);
			if (missing.length > 0) {
				result.set(locale, missing);
			}
		}
	}

	return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry Validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate all translation specs in a registry.
 *
 * @param registry - Translation registry to validate
 * @returns Validation result
 */
export function validateTranslationRegistry(
	registry: TranslationRegistry
): TranslationValidationResult {
	const issues: TranslationValidationIssue[] = [];

	for (const spec of registry.list()) {
		const specResult = validateTranslationSpec(spec);
		issues.push(
			...specResult.issues.map((i) => ({
				...i,
				path: `${spec.meta.key}.v${spec.meta.version}:${spec.locale}${i.path ? `.${i.path}` : ''}`,
			}))
		);
	}

	return {
		valid: issues.filter((i) => i.level === 'error').length === 0,
		issues,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Assertion Helpers
// ─────────────────────────────────────────────────────────────────────────────

export class TranslationValidationError extends Error {
	constructor(
		message: string,
		public readonly issues: TranslationValidationIssue[]
	) {
		super(message);
		this.name = 'TranslationValidationError';
	}
}

/**
 * Assert that a translation spec is valid, throwing if not.
 *
 * @param spec - Translation spec to validate
 * @throws {TranslationValidationError} If validation fails
 */
export function assertTranslationSpecValid(spec: TranslationSpec): void {
	const result = validateTranslationSpec(spec);
	if (!result.valid) {
		throw new TranslationValidationError(
			`Translation ${spec.meta.key}.v${spec.meta.version}:${spec.locale} is invalid`,
			result.issues
		);
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

export function canonicalizeLocale(locale: string): Locale | undefined {
	if (isLikelyLanguageName(locale)) {
		return undefined;
	}
	try {
		return Intl.getCanonicalLocales(locale)[0];
	} catch {
		return undefined;
	}
}

function isLikelyLanguageName(locale: string): boolean {
	return [
		'arabic',
		'chinese',
		'english',
		'french',
		'japanese',
		'spanish',
	].includes(locale.trim().toLowerCase());
}

export function isValidLocaleFormat(locale: string): boolean {
	return Boolean(canonicalizeLocale(locale));
}

function validateLocaleTag(
	locale: string,
	path: string,
	issues: TranslationValidationIssue[]
): void {
	const canonical = canonicalizeLocale(locale);
	if (!canonical) {
		issues.push({
			level: 'error',
			message: `Locale "${locale}" is not a valid BCP 47 language tag`,
			path,
		});
		return;
	}

	if (canonical !== locale) {
		issues.push({
			level: 'info',
			message: `Locale "${locale}" canonicalizes to "${canonical}"`,
			path,
			context: { canonical },
		});
	}
}

function validateLocaleKeySeparation(
	spec: TranslationSpec,
	issues: TranslationValidationIssue[]
): void {
	const locale = canonicalizeLocale(spec.locale) ?? spec.locale;
	const key = spec.meta.key;
	const localeSuffix = locale.replace(/-/g, '[-_.]');
	const localeInKey = new RegExp(`(^|[-_.])${localeSuffix}$`, 'i').test(key);
	if (localeInKey) {
		issues.push({
			level: 'warning',
			message:
				'Translation spec key appears to include the locale. Prefer a stable bundle key and keep locale in the locale field.',
			path: 'meta.key',
			context: { locale },
		});
	}
}
