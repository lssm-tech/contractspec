export type TextDirection = 'ltr' | 'rtl';

const RTL_LANGUAGES = new Set([
	'ar',
	'arc',
	'dv',
	'fa',
	'ha',
	'he',
	'ks',
	'ku',
	'ps',
	'ur',
	'yi',
]);

export function getTextDirection(locale: string): TextDirection {
	const language = getLanguageSubtag(locale);
	return RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr';
}

export function getLanguageSubtag(locale: string): string {
	try {
		return new Intl.Locale(locale).language.toLowerCase();
	} catch {
		return locale.split('-')[0]?.toLowerCase() ?? locale.toLowerCase();
	}
}
