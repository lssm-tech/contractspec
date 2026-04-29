import { describe, expect, it } from 'bun:test';
import type { TranslationSpec } from '@contractspec/lib.contracts-spec/translations';
import { getTextDirection } from './direction';
import { createStaticBundleLoader } from './loader';
import { canonicalizeLocale, negotiateLocale } from './locale';
import {
	createTranslationRuntime,
	createTranslationRuntimeFromSnapshot,
} from './runtime';

const base = (
	locale: string,
	messages: TranslationSpec['messages']
): TranslationSpec => ({
	meta: {
		key: 'demo.messages',
		version: '1.0.0',
		domain: 'demo',
		owners: ['platform'],
	},
	locale,
	fallback: 'en-US',
	messages,
});

const en = base('en-US', {
	'cart.items': {
		value:
			'{count, plural, =0 {No items} one {One item} other {{count} items}}',
	},
	'profile.pronoun': {
		value: '{gender, select, male {He} female {She} other {They}} liked this.',
	},
	'leaderboard.rank': {
		value:
			'{position, selectordinal, one {#st place} two {#nd place} few {#rd place} other {#th place}}',
	},
	'price.label': { value: 'Total: {amount, number, ::currency/USD}' },
	'fallback.only': { value: 'Fallback text' },
});

const ar = base('ar-EG', {
	'cart.items': {
		value:
			'{count, plural, zero {لا عناصر} one {عنصر واحد} two {عنصران} few {{count} عناصر} many {{count} عنصرًا} other {{count} عنصر}}',
	},
});

const zh = base('zh-Hans', {
	'cart.items': { value: '{count, plural, other {{count} 个项目}}' },
});

describe('translation-runtime locale support', () => {
	it('canonicalizes BCP 47 tags and negotiates regional fallbacks', () => {
		expect(canonicalizeLocale('zh-hans').locale).toBe('zh-Hans');
		const result = negotiateLocale({
			requestedLocales: ['fr-CA'],
			supportedLocales: ['fr', 'en-US'],
			defaultLocale: 'en-US',
		});

		expect(result.locale).toBe('fr');
		expect(result.fallbackChain).toContain('en-US');
	});

	it('returns first-class RTL metadata', () => {
		expect(getTextDirection('ar-EG')).toBe('rtl');
		expect(getTextDirection('zh-Hans')).toBe('ltr');
	});
});

describe('createTranslationRuntime', () => {
	it('formats ICU plural, select, selectordinal, and number messages', () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['en-US'],
			specs: [en],
		});

		expect(runtime.tUnknown('cart.items', { count: 0 })).toBe('No items');
		expect(runtime.tUnknown('cart.items', { count: 3 })).toBe('3 items');
		expect(runtime.tUnknown('profile.pronoun', { gender: 'female' })).toBe(
			'She liked this.'
		);
		expect(runtime.tUnknown('leaderboard.rank', { position: 2 })).toBe(
			'2nd place'
		);
		expect(runtime.tUnknown('price.label', { amount: 12 })).toContain('12');
	});

	it('supports Arabic plural categories and RTL locale resolution', () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['ar-EG'],
			specs: [en, ar],
		});

		expect(runtime.negotiation.direction).toBe('rtl');
		expect(runtime.tUnknown('cart.items', { count: 0 })).toBe('لا عناصر');
		expect(runtime.tUnknown('cart.items', { count: 2 })).toBe('عنصران');
		expect(runtime.tUnknown('cart.items', { count: 3 })).toBe('3 عناصر');
		expect(runtime.tUnknown('cart.items', { count: 11 })).toBe('11 عنصرًا');
	});

	it('supports CJK locales without singular/plural assumptions', () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['zh-Hans'],
			specs: [en, zh],
		});

		expect(runtime.tUnknown('cart.items', { count: 1 })).toBe('1 个项目');
		expect(runtime.tUnknown('cart.items', { count: 5 })).toBe('5 个项目');
	});

	it('falls back across locale variants of the same stable bundle', () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['ar-EG'],
			fallbackLocales: ['en-US'],
			specs: [en, ar],
		});

		expect(runtime.tUnknown('fallback.only')).toBe('Fallback text');
		expect(
			runtime.diagnostics().some((item) => item.code === 'fallback_used')
		).toBe(true);
	});

	it('honors fallback metadata declared on the ContractSpec translation variant', () => {
		const fr = base('fr-CA', {
			'cart.items': {
				value: '{count, plural, one {Un article} other {# articles}}',
			},
		});
		const runtime = createTranslationRuntime({
			defaultLocale: 'de-DE',
			requestedLocales: ['fr-CA'],
			specs: [en, fr],
		});

		expect(runtime.tUnknown('fallback.only')).toBe('Fallback text');
		expect(runtime.diagnostics().at(-1)).toMatchObject({
			code: 'fallback_used',
			fallbackLocale: 'en-US',
		});
	});

	it('applies override layers without leaking across runtime instances', () => {
		const tenant = base('en-US', {
			'fallback.only': { value: 'Tenant text' },
		});
		const tenantRuntime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['en-US'],
			specs: [en],
			overrides: [{ scope: 'tenant', source: 'tenant:acme', specs: [tenant] }],
		});
		const baseRuntime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['en-US'],
			specs: [en],
		});

		expect(tenantRuntime.tUnknown('fallback.only')).toBe('Tenant text');
		expect(baseRuntime.tUnknown('fallback.only')).toBe('Fallback text');
	});

	it('keeps request overrides authoritative after async base catalog loading', async () => {
		const requestOverride = base('en-US', {
			'fallback.only': { value: 'Request text' },
		});
		const loadedBase = base('en-US', {
			'fallback.only': { value: 'Loaded base text' },
		});
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['en-US'],
			specs: [en],
			overrides: [
				{
					scope: 'request',
					source: 'request:current',
					specs: [requestOverride],
				},
			],
			loaders: [createStaticBundleLoader([loadedBase])],
		});

		expect(runtime.tUnknown('fallback.only')).toBe('Request text');
		await runtime.load('demo.messages', ['en-US']);
		expect(runtime.tUnknown('fallback.only')).toBe('Request text');
		expect(
			createTranslationRuntimeFromSnapshot(runtime.snapshot()).tUnknown(
				'fallback.only'
			)
		).toBe('Request text');
	});

	it('loads catalogs asynchronously and reports missing messages', async () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['zh-Hans'],
			loaders: [createStaticBundleLoader([zh])],
		});

		expect(runtime.tUnknown('cart.items', { count: 1 })).toBe('cart.items');
		await runtime.load('demo.messages', ['zh-Hans']);
		expect(runtime.tUnknown('cart.items', { count: 1 })).toBe('1 个项目');
		expect(
			runtime.diagnostics().some((item) => item.code === 'missing_message')
		).toBe(true);
	});

	it('serializes and rehydrates deterministic SSR snapshots', () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['ar-EG'],
			specs: [en, ar],
		});
		const hydrated = createTranslationRuntimeFromSnapshot(runtime.snapshot());

		expect(hydrated.locale).toBe(runtime.locale);
		expect(hydrated.tUnknown('cart.items', { count: 2 })).toBe(
			runtime.tUnknown('cart.items', { count: 2 })
		);
	});
});
