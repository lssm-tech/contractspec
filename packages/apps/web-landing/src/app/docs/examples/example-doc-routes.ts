import {
	buildExampleDocsHref,
	listDiscoverableExamples,
} from '@contractspec/module.examples/catalog';

const DISCOVERABLE_EXAMPLE_KEYS = listDiscoverableExamples().map(
	(example) => example.meta.key
);

const DISCOVERABLE_EXAMPLE_KEY_SET = new Set(DISCOVERABLE_EXAMPLE_KEYS);

export function listDiscoverableExampleRouteParams(): { exampleKey: string }[] {
	return DISCOVERABLE_EXAMPLE_KEYS.map((exampleKey) => ({ exampleKey }));
}

export function listDiscoverableExampleDocsRoutes(): string[] {
	return DISCOVERABLE_EXAMPLE_KEYS.map((exampleKey) =>
		buildExampleDocsHref(exampleKey)
	);
}

export function isDiscoverableExampleKey(exampleKey: string): boolean {
	return DISCOVERABLE_EXAMPLE_KEY_SET.has(exampleKey);
}

export const listPublicExampleRouteParams = listDiscoverableExampleRouteParams;
export const listPublicExampleDocsRoutes = listDiscoverableExampleDocsRoutes;
export const isPublicExampleKey = isDiscoverableExampleKey;
