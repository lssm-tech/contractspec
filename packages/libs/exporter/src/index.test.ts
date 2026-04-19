import { describe, expect, it } from 'bun:test';
import { toCsvGeneric, toJsonGeneric, toXmlGeneric } from './index';

describe('@contractspec/lib.exporter', () => {
	it('preserves csv/xml legacy shapes and adds json export', () => {
		const payload = {
			meta: {
				documentId: 'doc-1',
				currency: 'EUR',
			},
			items: [
				{
					id: 'item-1',
					name: 'Chair',
					qty: 2,
					unitPrice: 10,
					currency: 'EUR',
				},
			],
		};

		const csv = toCsvGeneric(payload);
		expect(csv).toContain('documentId,currency,id,name,qty,unitPrice,currency');
		expect(csv).toContain('doc-1,EUR,item-1,Chair,2,10,EUR');

		const xml = toXmlGeneric(payload);
		expect(xml).toContain('<meta>');
		expect(xml).toContain('<item id="item-1">');

		const json = toJsonGeneric(payload);
		expect(json).toContain('"meta"');
		expect(json).toContain('"items"');
	});
});
