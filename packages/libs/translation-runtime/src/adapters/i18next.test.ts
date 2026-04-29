import { describe, expect, it } from 'bun:test';
import type { TranslationSpec } from '@contractspec/lib.contracts-spec/translations';
import { createInstance } from 'i18next';
import {
	addContractSpecResourceBundles,
	createI18nextInitOptions,
	exportContractSpecToI18next,
	exportTranslationSnapshotToI18next,
} from '../i18next';
import { createTranslationRuntime } from '../runtime';

const base = (
	locale: string,
	messages: TranslationSpec['messages'],
	overrides: Partial<TranslationSpec> = {}
): TranslationSpec => ({
	meta: {
		key: 'demo.messages',
		version: '1.0.0',
		domain: 'demo',
		owners: ['platform'],
	},
	locale,
	fallback: 'en-US',
	formatter: { syntax: 'icu', engine: 'intl-messageformat' },
	messages,
	...overrides,
});

const en = base('en-US', {
	'cart.items': {
		value:
			'{count, plural, =0 {No items} one {One item} other {{count} items}}',
		description: 'Shown in cart summary',
		context: 'cart summary item count',
		placeholders: [{ name: 'count', type: 'plural' }],
		tags: ['cart'],
	},
	'plain.title': { value: 'Cart' },
});

const ar = base(
	'ar-EG',
	{
		'cart.items': {
			value:
				'{count, plural, zero {لا عناصر} one {عنصر واحد} two {عنصران} few {{count} عناصر} many {{count} عنصرًا} other {{count} عنصر}}',
		},
	},
	{ direction: 'rtl' }
);

const zh = base('zh-Hans', {
	'cart.items': { value: '{count, plural, other {{count} 个项目}}' },
});

describe('ContractSpec i18next adapter', () => {
	it('exports locale-separated i18next resources with ContractSpec metadata', () => {
		const exported = exportContractSpecToI18next([en, ar, zh]);

		expect(exported.resources['en-US']?.['demo.messages']?.['cart.items']).toBe(
			en.messages['cart.items']?.value
		);
		expect(exported.resources['ar-EG']?.['demo.messages']?.['cart.items']).toBe(
			ar.messages['cart.items']?.value
		);
		expect(
			exported.resources['zh-Hans']?.['demo.messages']?.['cart.items']
		).toBe(zh.messages['cart.items']?.value);
		expect(exported.manifest.namespaces).toContainEqual(
			expect.objectContaining({
				direction: 'rtl',
				locale: 'ar-EG',
				namespace: 'demo.messages',
				specKey: 'demo.messages',
			})
		);
		expect(
			exported.manifest.messages['en-US']?.['demo.messages']?.['cart.items']
		).toMatchObject({
			context: 'cart summary item count',
			description: 'Shown in cart summary',
			placeholders: [{ name: 'count', type: 'plural' }],
		});
		expect(
			exported.manifest.diagnostics.some(
				(item) => item.code === 'i18next_icu_plugin_required'
			)
		).toBe(true);
	});

	it('creates hydration-safe i18next init options with flat dotted keys', async () => {
		const exported = exportContractSpecToI18next([en], {
			assumeIcuFormatter: true,
			lng: 'en-US',
		});
		const init = createI18nextInitOptions(exported);
		const i18next = createInstance();

		expect(init.options).toMatchObject({
			defaultNS: 'demo.messages',
			keySeparator: false,
			lng: 'en-US',
			ns: ['demo.messages'],
		});
		await i18next.init(init.options);
		expect(i18next.t('plain.title')).toBe('Cart');
	});

	it('adds ContractSpec resource bundles to a caller-owned i18next instance', async () => {
		const exported = exportContractSpecToI18next([en], {
			assumeIcuFormatter: true,
		});
		const i18next = createInstance();
		await i18next.init({ keySeparator: false, lng: 'en-US', resources: {} });

		addContractSpecResourceBundles(i18next, exported);

		expect(i18next.t('plain.title', { ns: 'demo.messages' })).toBe('Cart');
		expect(i18next.getResourceBundle('en-US', 'demo.messages')).toMatchObject({
			'plain.title': 'Cart',
		});
	});

	it('keeps fallback projection lossy diagnostics explicit', () => {
		const profileEn = base(
			'en-US',
			{ title: { value: 'Profile' } },
			{
				meta: {
					key: 'profile.messages',
					version: '1.0.0',
					domain: 'profile',
					owners: ['platform'],
				},
				fallbacks: ['fr-FR'],
			}
		);
		const exported = exportContractSpecToI18next([en, profileEn], {
			assumeIcuFormatter: true,
		});
		const init = createI18nextInitOptions(exported);

		expect(
			exported.manifest.diagnostics.some(
				(item) => item.code === 'i18next_fallback_projection_lossy'
			)
		).toBe(true);
		expect(
			init.diagnostics.some(
				(item) => item.code === 'i18next_fallback_projection_lossy'
			)
		).toBe(true);
	});

	it('exports deterministic SSR snapshot resources without renegotiation', () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['ar-EG'],
			specs: [en, ar],
		});
		const exported = exportTranslationSnapshotToI18next(runtime.snapshot(), {
			assumeIcuFormatter: true,
		});
		const server = createI18nextInitOptions(exported);
		const client = createI18nextInitOptions(exported);

		expect(server.options).toEqual(client.options);
		expect(server.diagnostics).toEqual(client.diagnostics);
		expect(exported.manifest.defaultLocale).toBe('en-US');
		expect(server.options).toMatchObject({ lng: 'ar-EG' });
	});

	it('reports namespace and resource collisions without overwriting values', () => {
		const other = base(
			'en-US',
			{ 'plain.title': { value: 'Other cart' } },
			{
				meta: {
					key: 'other.messages',
					version: '1.0.0',
					domain: 'demo',
					owners: ['platform'],
				},
			}
		);
		const exported = exportContractSpecToI18next([en, other], {
			assumeIcuFormatter: true,
			namespace: 'domain',
		});

		expect(
			exported.manifest.diagnostics.some(
				(item) => item.code === 'i18next_namespace_collision'
			)
		).toBe(true);
		expect(
			exported.manifest.diagnostics.some(
				(item) => item.code === 'i18next_resource_collision'
			)
		).toBe(true);
		expect(exported.resources['en-US']?.demo?.['plain.title']).toBe('Cart');
	});

	it('reports equal-value resource collisions when version or source differs', () => {
		const sameValueDifferentVersion = base(
			'en-US',
			{ 'plain.title': { value: 'Cart' } },
			{
				meta: {
					key: 'other.messages',
					version: '2.0.0',
					domain: 'demo',
					owners: ['platform'],
				},
			}
		);
		const exported = exportContractSpecToI18next(
			[en, sameValueDifferentVersion],
			{
				assumeIcuFormatter: true,
				namespace: 'domain',
			}
		);

		expect(
			exported.manifest.diagnostics.some(
				(item) => item.code === 'i18next_resource_collision'
			)
		).toBe(true);
		expect(
			exported.manifest.messages['en-US']?.demo?.['plain.title']?.version
		).toBe('1.0.0');
	});
});
