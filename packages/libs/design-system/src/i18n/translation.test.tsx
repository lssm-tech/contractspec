import { describe, expect, it } from 'bun:test';
import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';
import { createTranslationRuntime } from '@contractspec/lib.translation-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import {
	createRuntimeTranslationResolver,
	DesignSystemTranslationProvider,
	resolveTranslationString,
} from './translation';

const en = defineTranslation({
	meta: {
		key: 'design-system.test',
		version: '1.0.0',
		domain: 'design-system',
		owners: ['platform'],
	},
	locale: 'en-US',
	messages: {
		'field.items': {
			value: '{count, plural, one {One field} other {{count} fields}}',
		},
	},
});

const alternateEn = defineTranslation({
	meta: {
		key: 'design-system.alternate',
		version: '1.0.0',
		domain: 'design-system',
		owners: ['platform'],
	},
	locale: 'en-US',
	messages: {
		'field.items': {
			value: 'Alternate field copy',
		},
	},
});

describe('runtime-backed design-system translation resolver', () => {
	it('formats values through the translation runtime', () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['en-US'],
			specs: [en],
		});
		const resolver = createRuntimeTranslationResolver({ runtime });

		expect(resolveTranslationString('field.items', resolver)).toBe(
			'field.items'
		);
		expect(resolver('field.items', { count: 2 })).toBe('2 fields');
	});

	it('honors qualified spec keys when message keys collide', () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['en-US'],
			specs: [en, alternateEn],
		});
		const resolver = createRuntimeTranslationResolver({ runtime });

		expect(resolver('design-system.alternate::field.items', { count: 2 })).toBe(
			'Alternate field copy'
		);
		expect(resolver('design-system.test::field.items', { count: 2 })).toBe(
			'2 fields'
		);
	});

	it('preserves provider compatibility for server rendering', () => {
		const runtime = createTranslationRuntime({
			defaultLocale: 'en-US',
			requestedLocales: ['en-US'],
			specs: [en],
		});
		const resolver = createRuntimeTranslationResolver({ runtime });
		const html = renderToStaticMarkup(
			<DesignSystemTranslationProvider resolver={resolver}>
				<span>{resolver('field.items', { count: 1 })}</span>
			</DesignSystemTranslationProvider>
		);

		expect(html).toContain('One field');
	});
});
