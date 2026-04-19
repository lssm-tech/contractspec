import { describe, expect, test } from 'bun:test';
import {
	buildExampleDocsHref,
	listPublicExamples,
} from '@contractspec/module.examples';
import {
	isPublicExampleKey,
	listPublicExampleDocsRoutes,
	listPublicExampleRouteParams,
} from './example-doc-routes';

describe('example doc routes', () => {
	test('exposes a docs route for every public example', () => {
		const expectedKeys = listPublicExamples().map(
			(example) => example.meta.key
		);
		const actualKeys = listPublicExampleRouteParams().map(
			({ exampleKey }) => exampleKey
		);

		expect(actualKeys.sort()).toEqual(expectedKeys.sort());
		expect(listPublicExampleDocsRoutes().sort()).toEqual(
			expectedKeys.map((key) => buildExampleDocsHref(key)).sort()
		);
	});

	test('identifies valid public example keys', () => {
		expect(isPublicExampleKey('agent-console')).toBe(true);
		expect(isPublicExampleKey('does-not-exist')).toBe(false);
	});
});
