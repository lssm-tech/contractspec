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
});
