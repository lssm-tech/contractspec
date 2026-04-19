import {
	buildExampleDocsHref,
	listPublicExamples,
} from '@contractspec/module.examples';

const PUBLIC_EXAMPLE_KEYS = listPublicExamples().map(
	(example) => example.meta.key
);

const PUBLIC_EXAMPLE_KEY_SET = new Set(PUBLIC_EXAMPLE_KEYS);

export function listPublicExampleRouteParams(): { exampleKey: string }[] {
	return PUBLIC_EXAMPLE_KEYS.map((exampleKey) => ({ exampleKey }));
}

export function listPublicExampleDocsRoutes(): string[] {
	return PUBLIC_EXAMPLE_KEYS.map((exampleKey) =>
		buildExampleDocsHref(exampleKey)
	);
}

export function isPublicExampleKey(exampleKey: string): boolean {
	return PUBLIC_EXAMPLE_KEY_SET.has(exampleKey);
}
