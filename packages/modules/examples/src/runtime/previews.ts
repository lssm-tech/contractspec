import type { ExampleSpec } from '@contractspec/lib.contracts-spec/examples/types';
import { getExample, listExamples } from '../registry';
import { INLINE_EXAMPLE_PREVIEW_REGISTRY } from './previews.generated';

export interface InlineExamplePreviewDefinition {
	key: string;
	exportName: string;
	loadModule: () => Promise<Record<string, unknown>>;
	title: string;
	description: string;
}

const PUBLIC_EXAMPLES = listExamples().filter(
	(example) => example.meta.visibility === 'public'
);

const PUBLIC_EXAMPLE_BY_KEY = new Map(
	PUBLIC_EXAMPLES.map((example) => [example.meta.key, example] as const)
);

const INLINE_EXAMPLE_PREVIEWS = INLINE_EXAMPLE_PREVIEW_REGISTRY.flatMap(
	(registration): InlineExamplePreviewDefinition[] => {
		const example = getExample(registration.key);

		if (!example?.entrypoints.ui) {
			return [];
		}

		return [
			{
				...registration,
				title: example.meta.title ?? example.meta.key,
				description: example.meta.summary ?? example.meta.description ?? '',
			},
		];
	}
);

const INLINE_EXAMPLE_PREVIEW_BY_KEY = new Map(
	INLINE_EXAMPLE_PREVIEWS.map((preview) => [preview.key, preview] as const)
);

export function listPublicExamples(): readonly ExampleSpec[] {
	return PUBLIC_EXAMPLES;
}

export function getPublicExample(exampleKey: string): ExampleSpec | undefined {
	return PUBLIC_EXAMPLE_BY_KEY.get(exampleKey);
}

export function listInlineExamplePreviews(): readonly InlineExamplePreviewDefinition[] {
	return INLINE_EXAMPLE_PREVIEWS;
}

export function getInlineExamplePreview(
	exampleKey: string
): InlineExamplePreviewDefinition | undefined {
	return INLINE_EXAMPLE_PREVIEW_BY_KEY.get(exampleKey);
}

export function supportsInlineExamplePreview(exampleKey: string): boolean {
	return INLINE_EXAMPLE_PREVIEW_BY_KEY.has(exampleKey);
}

export function buildExampleDocsHref(exampleKey: string): string {
	return `/docs/examples/${encodeURIComponent(exampleKey)}`;
}

export function buildExampleReferenceHref(exampleKey: string): string {
	const slug = encodeURIComponent(exampleKey);
	return `/docs/reference/${slug}/${slug}`;
}

export function getExamplePreviewHref(exampleKey: string): string | null {
	const example = getExample(exampleKey);

	if (!example?.surfaces.sandbox.enabled) {
		return null;
	}

	return `/sandbox?template=${encodeURIComponent(exampleKey)}`;
}
