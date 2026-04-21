import { describe, expect, test } from 'bun:test';
import {
	buildExampleDocsHref,
	getExample,
	listDiscoverableExamples,
} from '@contractspec/module.examples';
import {
	isDiscoverableExampleKey,
	listDiscoverableExampleDocsRoutes,
	listDiscoverableExampleRouteParams,
} from './example-doc-routes';

describe('example doc routes', () => {
	test('exposes a docs route for every discoverable example', () => {
		const expectedKeys = listDiscoverableExamples().map(
			(example) => example.meta.key
		);
		const actualKeys = listDiscoverableExampleRouteParams().map(
			({ exampleKey }) => exampleKey
		);

		expect(actualKeys.sort()).toEqual(expectedKeys.sort());
		expect(listDiscoverableExampleDocsRoutes().sort()).toEqual(
			expectedKeys.map((key) => buildExampleDocsHref(key)).sort()
		);
		expect(actualKeys.length).toBeGreaterThan(40);
		expect(actualKeys).toContain('crm-pipeline');
		expect(actualKeys).toContain('learning-journey-registry');
	});

	test('identifies valid discoverable example keys', () => {
		expect(isDiscoverableExampleKey('agent-console')).toBe(true);
		expect(isDiscoverableExampleKey('crm-pipeline')).toBe(true);
		expect(isDiscoverableExampleKey('does-not-exist')).toBe(false);
		expect(
			listDiscoverableExampleRouteParams().every(({ exampleKey }) => {
				const example = getExample(exampleKey);
				return example?.meta.visibility !== 'internal';
			})
		).toBe(true);
	});
});
