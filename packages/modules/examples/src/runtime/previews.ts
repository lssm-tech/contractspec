import {
	getInlineExamplePreviewMetadata,
	listInlineExamplePreviewMetadata,
} from '../preview-catalog';
import { INLINE_EXAMPLE_PREVIEW_REGISTRY } from './previews.generated';

export {
	buildExampleDocsHref,
	buildExampleReferenceHref,
	getDiscoverableExample,
	getExamplePreviewHref,
	getExamplePreviewSurface,
	getPublicExample,
	isDiscoverableExample,
	listDiscoverableExamples,
	listExamplePreviewSurfaces,
	listPublicExamples,
	listTemplateExamples,
	supportsInlineExamplePreview,
} from '../preview-catalog';

export interface InlineExamplePreviewDefinition {
	key: string;
	exportName: string;
	loadModule: () => Promise<Record<string, unknown>>;
	title: string;
	description: string;
}

const INLINE_EXAMPLE_PREVIEWS = INLINE_EXAMPLE_PREVIEW_REGISTRY.flatMap(
	(registration): InlineExamplePreviewDefinition[] => {
		const metadata = getInlineExamplePreviewMetadata(registration.key);

		if (!metadata) {
			return [];
		}

		return [
			{
				...registration,
				title: metadata.title,
				description: metadata.description,
			},
		];
	}
);

const INLINE_EXAMPLE_PREVIEW_BY_KEY = new Map(
	INLINE_EXAMPLE_PREVIEWS.map((preview) => [preview.key, preview] as const)
);

export function listInlineExamplePreviews(): readonly InlineExamplePreviewDefinition[] {
	return INLINE_EXAMPLE_PREVIEWS;
}

export function getInlineExamplePreview(
	exampleKey: string
): InlineExamplePreviewDefinition | undefined {
	const metadata = getInlineExamplePreviewMetadata(exampleKey);
	return metadata ? INLINE_EXAMPLE_PREVIEW_BY_KEY.get(metadata.key) : undefined;
}

export const listInlineExamplePreviewsMetadata =
	listInlineExamplePreviewMetadata;
