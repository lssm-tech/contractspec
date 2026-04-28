import {
	type ExamplePreviewSurface,
	getExamplePreviewSurface,
	listDiscoverableExamples,
} from '@contractspec/module.examples/catalog';
import {
	getRichPreviewOverride,
	type NativeExamplePreviewKind,
} from './native-preview-overrides';

export interface NativeExamplePreviewDefinition {
	key: string;
	title: string;
	description: string;
	kind: NativeExamplePreviewKind;
	route: string;
	rich: boolean;
	surface: ExamplePreviewSurface;
}

export function listNativeExamplePreviews(): readonly NativeExamplePreviewDefinition[] {
	return listDiscoverableExamples().flatMap(
		(example): NativeExamplePreviewDefinition[] => {
			const preview = getNativeExamplePreview(example.meta.key);
			return preview ? [preview] : [];
		}
	);
}

export function getNativeExamplePreview(
	exampleKey: string
): NativeExamplePreviewDefinition | undefined {
	const surface = getExamplePreviewSurface(exampleKey);

	if (!surface) {
		return undefined;
	}

	const richPreview = getRichPreviewOverride(surface.key);

	return {
		key: surface.key,
		title: richPreview?.title ?? surface.title,
		description:
			richPreview?.description ??
			'ContractSpec package, surfaces, metadata, and links rendered in-app.',
		kind: richPreview?.kind ?? 'generic',
		route: `/example-preview?exampleKey=${encodeURIComponent(surface.key)}`,
		rich: Boolean(richPreview),
		surface,
	};
}

export function supportsNativeExamplePreview(exampleKey: string): boolean {
	return Boolean(getNativeExamplePreview(exampleKey));
}
