import { describe, expect, it } from 'bun:test';
import {
	DEFAULT_LOCALE,
	isSupportedLocale,
	resolveLocale,
	SUPPORTED_LOCALES,
} from './locale';

describe('resolveLocale', () => {
	it('defaults to "en" when no locale is provided', () => {
		expect(resolveLocale()).toBe('en');
		expect(resolveLocale(undefined, undefined)).toBe('en');
	});

	it('uses the provided options locale', () => {
		expect(resolveLocale('fr')).toBe('fr');
		expect(resolveLocale('es')).toBe('es');
	});

	it('prefers runtime locale over options locale', () => {
		expect(resolveLocale('fr', 'es')).toBe('es');
		expect(resolveLocale('en', 'fr')).toBe('fr');
	});

	it('falls back to base language for regional variants', () => {
		expect(resolveLocale('fr-CA')).toBe('fr');
		expect(resolveLocale('es-MX')).toBe('es');
		expect(resolveLocale('en-US')).toBe('en');
	});

	it('falls back to the default locale for unsupported locales', () => {
		expect(resolveLocale('de')).toBe('en');
		expect(resolveLocale('ja')).toBe('en');
		expect(resolveLocale('zh-CN')).toBe('en');
	});
});

describe('locale helpers', () => {
	it('reports supported locales', () => {
		expect(isSupportedLocale('en')).toBe(true);
		expect(isSupportedLocale('fr')).toBe(true);
		expect(isSupportedLocale('es')).toBe(true);
		expect(isSupportedLocale('de')).toBe(false);
		expect(isSupportedLocale('fr-CA')).toBe(false);
	});

	it('exports the expected default locale and supported locales', () => {
		expect(DEFAULT_LOCALE).toBe('en');
		expect(SUPPORTED_LOCALES).toEqual(['en', 'fr', 'es']);
	});
});
