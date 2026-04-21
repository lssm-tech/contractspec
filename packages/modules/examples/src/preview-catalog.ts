import type { ExampleSpec } from '@contractspec/lib.contracts-spec/examples/types';
import { INLINE_EXAMPLE_PREVIEW_METADATA } from './preview-catalog.generated';
import {
	getExample,
	getExampleId,
	getExampleSource,
	listExamples,
} from './registry';

export interface InlineExamplePreviewMetadata {
	key: string;
	exportName: string;
	title: string;
	description: string;
}

export interface ExamplePreviewSurface {
	key: string;
	title: string;
	description: string;
	packageName: string;
	docsHref: string;
	referenceHref: string;
	llmsHref: string;
	sandboxHref: string | null;
	sourceHref: string | null;
	tags: readonly string[];
	visibility: string;
	stability: string;
	supportsInlinePreview: boolean;
}

const PUBLIC_EXAMPLES = listExamples().filter(
	(example) => example.meta.visibility === 'public'
);

export function isDiscoverableExample(example: ExampleSpec): boolean {
	return (
		example.meta.visibility !== 'internal' &&
		(example.surfaces.templates ||
			example.surfaces.sandbox.enabled ||
			Boolean(example.docs))
	);
}

const DISCOVERABLE_EXAMPLES = listExamples().filter(isDiscoverableExample);

const TEMPLATE_EXAMPLES = listExamples().filter(
	(example) =>
		example.meta.visibility !== 'internal' && example.surfaces.templates
);

const INLINE_EXAMPLE_PREVIEW_METADATA_ITEMS =
	INLINE_EXAMPLE_PREVIEW_METADATA.flatMap(
		(registration): InlineExamplePreviewMetadata[] => {
			const example = getExample(registration.key);

			if (!example) {
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

const INLINE_EXAMPLE_PREVIEW_METADATA_BY_KEY = new Map(
	INLINE_EXAMPLE_PREVIEW_METADATA_ITEMS.map(
		(preview) => [preview.key, preview] as const
	)
);

export function listPublicExamples(): readonly ExampleSpec[] {
	return PUBLIC_EXAMPLES;
}

export function getPublicExample(exampleKey: string): ExampleSpec | undefined {
	const example = getExample(exampleKey);
	return example?.meta.visibility === 'public' ? example : undefined;
}

export function listDiscoverableExamples(): readonly ExampleSpec[] {
	return DISCOVERABLE_EXAMPLES;
}

export function getDiscoverableExample(
	exampleKey: string
): ExampleSpec | undefined {
	const example = getExample(exampleKey);
	return example && isDiscoverableExample(example) ? example : undefined;
}

export function listTemplateExamples(): readonly ExampleSpec[] {
	return TEMPLATE_EXAMPLES;
}

export function listInlineExamplePreviewMetadata(): readonly InlineExamplePreviewMetadata[] {
	return INLINE_EXAMPLE_PREVIEW_METADATA_ITEMS;
}

export function getInlineExamplePreviewMetadata(
	exampleKey: string
): InlineExamplePreviewMetadata | undefined {
	return INLINE_EXAMPLE_PREVIEW_METADATA_BY_KEY.get(getExampleId(exampleKey));
}

export function supportsInlineExamplePreview(exampleKey: string): boolean {
	return INLINE_EXAMPLE_PREVIEW_METADATA_BY_KEY.has(getExampleId(exampleKey));
}

export function buildExampleDocsHref(exampleKey: string): string {
	return `/docs/examples/${encodeURIComponent(getExampleId(exampleKey))}`;
}

export function buildExampleReferenceHref(exampleKey: string): string {
	const slug = encodeURIComponent(getExampleId(exampleKey));
	return `/docs/reference/${slug}/${slug}`;
}

export function buildExampleLlmsHref(exampleKey: string): string | null {
	const example = getExample(exampleKey);
	const packageName = example?.entrypoints.packageName;

	if (!packageName) {
		return null;
	}

	return `/llms/${packageName.replace('@contractspec/', '')}`;
}

export function buildExampleSourceHref(exampleKey: string): string | null {
	const source = getExampleSource(exampleKey);

	if (!source) {
		return null;
	}

	return `${source.repositoryUrl.replace(/\.git$/, '')}/tree/${source.defaultRef}/${source.directory}`;
}

export function getExamplePreviewHref(exampleKey: string): string | null {
	const example = getExample(exampleKey);

	if (!example?.surfaces.sandbox.enabled) {
		return null;
	}

	return `/sandbox?template=${encodeURIComponent(getExampleId(exampleKey))}`;
}

export function getExamplePreviewSurface(
	exampleKey: string
): ExamplePreviewSurface | undefined {
	const example = getDiscoverableExample(exampleKey);

	if (!example) {
		return undefined;
	}

	return {
		key: example.meta.key,
		title: example.meta.title ?? example.meta.key,
		description: example.meta.summary ?? example.meta.description ?? '',
		packageName: example.entrypoints.packageName,
		docsHref: buildExampleDocsHref(example.meta.key),
		referenceHref: buildExampleReferenceHref(example.meta.key),
		llmsHref: buildExampleLlmsHref(example.meta.key) ?? '',
		sandboxHref: getExamplePreviewHref(example.meta.key),
		sourceHref: buildExampleSourceHref(example.meta.key),
		tags: example.meta.tags ?? [],
		visibility: example.meta.visibility,
		stability: example.meta.stability,
		supportsInlinePreview: supportsInlineExamplePreview(example.meta.key),
	};
}

export function listExamplePreviewSurfaces(): readonly ExamplePreviewSurface[] {
	return DISCOVERABLE_EXAMPLES.flatMap((example): ExamplePreviewSurface[] => {
		const surface = getExamplePreviewSurface(example.meta.key);
		return surface ? [surface] : [];
	});
}
