import { describe, expect, it } from 'bun:test';
import { enMessages } from './catalogs/en';
import { esMessages } from './catalogs/es';
import { frMessages } from './catalogs/fr';
import { I18N_KEYS } from './keys';

describe('catalog completeness', () => {
	const allKeys = Object.keys(I18N_KEYS);

	it('defines every key in the English catalog', () => {
		const enKeys = Object.keys(enMessages.messages);
		for (const key of allKeys) {
			expect(enKeys).toContain(key);
		}
	});

	it('defines every key in the French catalog', () => {
		const frKeys = Object.keys(frMessages.messages);
		for (const key of allKeys) {
			expect(frKeys).toContain(key);
		}
	});

	it('defines every key in the Spanish catalog', () => {
		const esKeys = Object.keys(esMessages.messages);
		for (const key of allKeys) {
			expect(esKeys).toContain(key);
		}
	});

	it('keeps all catalogs at the same size', () => {
		expect(Object.keys(enMessages.messages)).toHaveLength(allKeys.length);
		expect(Object.keys(frMessages.messages)).toHaveLength(allKeys.length);
		expect(Object.keys(esMessages.messages)).toHaveLength(allKeys.length);
	});
});
