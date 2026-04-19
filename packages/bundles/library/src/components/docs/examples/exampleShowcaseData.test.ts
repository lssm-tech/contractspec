import { describe, expect, test } from 'bun:test';
import { listPublicExamples } from '@contractspec/module.examples';
import { getExampleShowcaseData } from './exampleShowcaseData';

describe('example showcase data', () => {
	test('builds showcase data for every public example', () => {
		for (const example of listPublicExamples()) {
			expect(getExampleShowcaseData(example.meta.key)).toBeDefined();
		}
	});

	test('preserves override copy and generic fallback links', () => {
		const dataGrid = getExampleShowcaseData('data-grid-showcase');
		const calendar = getExampleShowcaseData('calendar-google');

		expect(dataGrid?.lead).toContain('Canonical table example');
		expect(calendar?.sandboxHref).toBe('/sandbox?template=calendar-google');
		expect(calendar?.referenceHref).toBe(
			'/docs/reference/calendar-google/calendar-google'
		);
	});
});
