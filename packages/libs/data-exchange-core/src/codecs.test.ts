import { describe, expect, it } from 'bun:test';
import {
	formatCsvBatch,
	formatJsonBatch,
	formatXmlBatch,
	parseCsvContent,
	parseJsonContent,
	parseXmlContent,
} from './codecs';
import { createRecordBatch } from './records';

describe('data-exchange-core codecs', () => {
	it('round-trips csv, json, and xml batches', () => {
		const batch = createRecordBatch(
			[
				{ id: '1', profile: { email: 'one@example.com' }, active: 'true' },
				{ id: '2', profile: { email: 'two@example.com' }, active: 'false' },
			],
			{
				name: 'users',
				metadata: { source: 'unit-test' },
			}
		);

		const csv = formatCsvBatch(batch);
		expect(parseCsvContent(csv).records[0]?.['profile.email']).toBe(
			'one@example.com'
		);

		const json = formatJsonBatch(batch);
		expect(parseJsonContent(json).records[1]?.id).toBe('2');

		const xml = formatXmlBatch(batch, {
			rootTag: 'records',
			recordTag: 'record',
		});
		expect(parseXmlContent(xml).records[0]?.profile).toEqual({
			email: 'one@example.com',
		});
	});

	it('supports flexible csv, json, and xml codec options', () => {
		const csv = 'skip me\nExternal ID;Status\nacc-1;active';
		const csvBatch = parseCsvContent(csv, {
			delimiter: ';',
			skipRows: 1,
		});
		expect(csvBatch.records[0]?.['External ID']).toBe('acc-1');
		expect(
			parseCsvContent('skip\nalso skip\nExternal ID;Status\nacc-9;ready', {
				delimiter: ';',
				skipRows: 1,
				headerRow: 1,
			}).records[0]?.Status
		).toBe('ready');
		expect(
			parseCsvContent("'a''b';x", {
				delimiter: ';',
				quote: "'",
				headerRow: -1,
				columns: ['quoted', 'plain'],
			}).records[0]?.quoted
		).toBe("a'b");

		const headerlessCsv = 'acc-2|inactive';
		const headerlessBatch = parseCsvContent(headerlessCsv, {
			delimiter: '|',
			headerRow: -1,
			columns: ['id', 'status'],
		});
		expect(headerlessBatch.records[0]?.status).toBe('inactive');
		expect(
			parseCsvContent('acc-3', {
				headerRow: -1,
				columns: ['id', 'status'],
			}).records[0]?.status
		).toBe('');
		const quotedCsv = formatCsvBatch(
			createRecordBatch([{ 'id;value': "a'b\nc", status: 'ready' }]),
			{ delimiter: ';', quote: "'", columns: ['id;value', 'status'] }
		);
		expect(quotedCsv.split('\n')[0]).toBe("'id;value';status");
		expect(
			parseCsvContent(quotedCsv, { delimiter: ';', quote: "'" }).records[0]?.[
				'id;value'
			]
		).toBe("a'b\nc");

		const jsonBatch = parseJsonContent(
			JSON.stringify({ meta: { source: 'partner' }, rows: [{ id: 'json-1' }] }),
			{ recordsKey: 'rows', metadataKey: 'meta' }
		);
		expect(jsonBatch.metadata?.source).toBe('partner');
		expect(jsonBatch.records[0]?.id).toBe('json-1');
		const json = formatJsonBatch(jsonBatch, {
			recordsKey: 'rows',
			metadataKey: 'meta',
		});
		expect(
			parseJsonContent(json, { recordsKey: 'rows', metadataKey: 'meta' })
				.records[0]?.id
		).toBe('json-1');
		expect(
			parseJsonContent(JSON.stringify({ meta: { source: 'fallback' } }), {
				recordsKey: 'missing',
				metadataKey: 'meta',
			}).records
		).toEqual([]);

		const xml = formatXmlBatch(
			createRecordBatch([{ id: 'xml-1', name: 'One & "Two"' }], {
				metadata: { source: 'xml-test' },
			}),
			{
				attributeFields: ['id'],
				rootTag: 'accounts',
				recordTag: 'account',
				metadataTag: 'metadata',
			}
		);
		const xmlBatch = parseXmlContent(xml, {
			rootTag: 'accounts',
			recordTag: 'account',
			metadataTag: 'metadata',
		});
		expect(xmlBatch.records[0]?.id).toBe('xml-1');
		expect(xmlBatch.records[0]?.name).toBe('One & "Two"');
		expect(xmlBatch.metadata?.source).toBe('xml-test');
		expect(
			parseXmlContent(xml, {
				rootTag: 'accounts',
				recordTag: 'account',
				metadataTag: 'metadata',
				includeMetadata: false,
			}).metadata
		).toEqual({});
	});
});
