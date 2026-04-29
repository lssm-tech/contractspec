import type { Locale } from '@contractspec/lib.contracts-spec/translations';
import { getTextDirection, type TextDirection } from './direction';

export interface LocaleCanonicalizationResult {
	input: string;
	locale?: Locale;
	valid: boolean;
	error?: string;
}

export interface LocaleNegotiationOptions {
	requestedLocales?: readonly string[];
	supportedLocales?: readonly string[];
	defaultLocale: string;
	fallbackLocales?: readonly string[];
}

export interface LocaleNegotiationResult {
	locale: Locale;
	requestedLocales: Locale[];
	supportedLocales: Locale[];
	fallbackChain: Locale[];
	direction: TextDirection;
	defaultLocale: Locale;
}

export function canonicalizeLocale(
	input: string
): LocaleCanonicalizationResult {
	const trimmed = input.trim();
	if (!trimmed) {
		return { input, valid: false, error: 'Locale is empty' };
	}

	try {
		const canonical = Intl.getCanonicalLocales(trimmed)[0];
		return canonical
			? { input, locale: canonical, valid: true }
			: { input, valid: false, error: 'Locale did not canonicalize' };
	} catch (error) {
		return {
			input,
			valid: false,
			error: error instanceof Error ? error.message : 'Invalid locale',
		};
	}
}

export function canonicalizeLocales(inputs: readonly string[] = []): Locale[] {
	const locales: Locale[] = [];
	for (const input of inputs) {
		const result = canonicalizeLocale(input);
		if (result.locale && !locales.includes(result.locale)) {
			locales.push(result.locale);
		}
	}
	return locales;
}

export function negotiateLocale(
	options: LocaleNegotiationOptions
): LocaleNegotiationResult {
	const defaultLocale =
		canonicalizeLocale(options.defaultLocale).locale ?? options.defaultLocale;
	const requestedLocales = canonicalizeLocales(options.requestedLocales);
	const supportedLocales = canonicalizeLocales(options.supportedLocales);
	const fallbacks = canonicalizeLocales(options.fallbackLocales);
	const supported = supportedLocales.length
		? supportedLocales
		: [defaultLocale];

	for (const requested of requestedLocales) {
		const chain = buildLocaleFallbackChain(requested, defaultLocale, fallbacks);
		const match = chain.find((candidate) => supported.includes(candidate));
		if (match) {
			return buildNegotiationResult(
				match,
				requestedLocales,
				supported,
				defaultLocale,
				fallbacks
			);
		}
	}

	return buildNegotiationResult(
		defaultLocale,
		requestedLocales,
		supported,
		defaultLocale,
		fallbacks
	);
}

export function buildLocaleFallbackChain(
	locale: string,
	defaultLocale: string,
	explicitFallbacks: readonly string[] = []
): Locale[] {
	const chain: Locale[] = [];
	const add = (candidate: string | undefined) => {
		if (!candidate) return;
		const canonical = canonicalizeLocale(candidate).locale ?? candidate;
		if (!chain.includes(canonical)) chain.push(canonical);
	};

	add(locale);
	for (const candidate of localeParents(locale)) add(candidate);
	for (const fallback of explicitFallbacks) add(fallback);
	add(defaultLocale);
	return chain;
}

function localeParents(locale: string): string[] {
	const canonical = canonicalizeLocale(locale).locale ?? locale;
	const parts = canonical.split('-');
	const parents: string[] = [];
	while (parts.length > 1) {
		parts.pop();
		parents.push(parts.join('-'));
	}
	return parents;
}

function buildNegotiationResult(
	locale: Locale,
	requestedLocales: Locale[],
	supportedLocales: Locale[],
	defaultLocale: Locale,
	explicitFallbacks: Locale[]
): LocaleNegotiationResult {
	return {
		locale,
		requestedLocales,
		supportedLocales,
		fallbackChain: buildLocaleFallbackChain(
			locale,
			defaultLocale,
			explicitFallbacks
		),
		direction: getTextDirection(locale),
		defaultLocale,
	};
}
