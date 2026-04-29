import type { Locale } from './spec';

export interface LocaleCanonicalizationResult {
	input: string;
	locale?: Locale;
	valid: boolean;
	error?: string;
}

export function canonicalizeTranslationLocale(
	input: string
): LocaleCanonicalizationResult {
	const trimmed = input.trim();
	if (!trimmed) {
		return { input, valid: false, error: 'Locale is empty' };
	}
	try {
		const locale = Intl.getCanonicalLocales(trimmed)[0];
		return locale
			? { input, locale, valid: true }
			: { input, valid: false, error: 'Locale did not canonicalize' };
	} catch (error) {
		return {
			input,
			valid: false,
			error: error instanceof Error ? error.message : 'Invalid BCP 47 locale',
		};
	}
}

export function isValidTranslationLocale(input: string): boolean {
	return canonicalizeTranslationLocale(input).valid;
}
